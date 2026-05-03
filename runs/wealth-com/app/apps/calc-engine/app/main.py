"""calc-engine FastAPI server (Slice-5).

Per ADR-001:
- Pure deterministic functions only. No LLM calls.
- Every response carries rule_id, citation, computation_version, breakdown.
- Caller (api service) is responsible for writing the ComputationTrace to the
  WORM audit log on its side; this service emits the trace shape but does not
  persist directly.

Endpoints:
- GET  /health
- GET  /v1/rules                              — list available rules
- POST /v1/calc/federal-estate-tax            — compute under OBBBA 2026 baseline
- POST /v1/calc/grat-remainder                — Slice-6 (forthcoming)
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator

from app.rules.federal_estate_tax_obbba import (
    BASE_EXEMPTION_2026,
    COMPUTATION_VERSION,
    RULE_CITATION,
    RULE_ID,
    TOP_RATE,
    FederalEstateTaxInputs,
    compute_federal_estate_tax,
)

app = FastAPI(
    title="EstateCompass calc-engine",
    description="Deterministic estate/tax calc engine. Per ADR-001: no LLM arithmetic.",
    version="0.1.0",
)


# ---------- DTOs ----------


class FederalEstateTaxRequest(BaseModel):
    gross_estate: Decimal = Field(..., ge=0)
    funeral_admin_expenses: Decimal = Field(default=Decimal("0"), ge=0)
    debts: Decimal = Field(default=Decimal("0"), ge=0)
    marital_deduction: Decimal = Field(default=Decimal("0"), ge=0)
    charitable_deduction: Decimal = Field(default=Decimal("0"), ge=0)
    dsue_amount: Decimal = Field(default=Decimal("0"), ge=0)

    @field_validator(
        "gross_estate",
        "funeral_admin_expenses",
        "debts",
        "marital_deduction",
        "charitable_deduction",
        "dsue_amount",
    )
    @classmethod
    def must_be_finite(cls, v: Decimal) -> Decimal:
        if v.is_nan() or v.is_infinite():
            raise ValueError("must be finite")
        return v


class FederalEstateTaxResponse(BaseModel):
    rule_id: str
    citation: str
    computation_version: str
    inputs: dict[str, Decimal]
    adjusted_gross_estate: Decimal
    available_exemption: Decimal
    taxable_estate: Decimal
    federal_estate_tax: Decimal
    breakdown: dict[str, Decimal]


# ---------- routes ----------


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "calc-engine"}


@app.get("/v1/rules")
def list_rules() -> dict[str, list[dict[str, Any]]]:
    return {
        "rules": [
            {
                "rule_id": RULE_ID,
                "citation": RULE_CITATION,
                "computation_version": COMPUTATION_VERSION,
                "constants": {
                    "base_exemption_2026": str(BASE_EXEMPTION_2026),
                    "top_rate": str(TOP_RATE),
                },
            },
            # GRAT and DSUE rules forthcoming Slice-6
        ],
    }


@app.post("/v1/calc/federal-estate-tax", response_model=FederalEstateTaxResponse)
def federal_estate_tax(request: FederalEstateTaxRequest) -> FederalEstateTaxResponse:
    try:
        result = compute_federal_estate_tax(
            FederalEstateTaxInputs(
                gross_estate=request.gross_estate,
                funeral_admin_expenses=request.funeral_admin_expenses,
                debts=request.debts,
                marital_deduction=request.marital_deduction,
                charitable_deduction=request.charitable_deduction,
                dsue_amount=request.dsue_amount,
            )
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    return FederalEstateTaxResponse(
        rule_id=result.rule_id,
        citation=result.citation,
        computation_version=result.computation_version,
        inputs=request.model_dump(),
        adjusted_gross_estate=result.adjusted_gross_estate,
        available_exemption=result.available_exemption,
        taxable_estate=result.taxable_estate,
        federal_estate_tax=result.federal_estate_tax,
        breakdown=result.breakdown,
    )
