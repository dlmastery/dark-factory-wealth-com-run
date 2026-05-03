"""ai-extract FastAPI server (Slice-4) — Sage extractor.

Per ADR-003: every output is grounded; the validator below is non-negotiable.
The actual LLM call lives in extractors/claude_grounded.py (production) and
extractors/mock_grounded.py (testing without an API key).

Endpoints:
- GET  /health
- POST /v1/extract              — run extraction on a document; returns ExtractedFact[]
"""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.extractors.mock_grounded import MockGroundedExtractor
from app.validators.grounding import validate_grounding

app = FastAPI(
    title="EstateCompass ai-extract (Sage)",
    description="Document extraction with citation grounding per ADR-003.",
    version="0.1.0",
)


class ExtractRequest(BaseModel):
    document_id: str
    tenant_id: str
    document_text: str
    requested_field_paths: list[str] | None = None


class ExtractResponse(BaseModel):
    document_id: str
    tenant_id: str
    extracted_at: str
    model_version: str
    facts: list[dict[str, Any]]
    refusals: list[dict[str, Any]]
    grounding_validation: dict[str, Any]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai-extract"}


@app.post("/v1/extract", response_model=ExtractResponse)
def extract(req: ExtractRequest) -> ExtractResponse:
    if not req.document_text.strip():
        raise HTTPException(status_code=400, detail="document_text is empty")

    # Choose extractor: mock by default; Claude when ANTHROPIC_API_KEY set
    # (claude_grounded.py is forthcoming; mock implements the same contract).
    extractor = MockGroundedExtractor()
    raw_output = extractor.extract(
        document_text=req.document_text,
        document_id=req.document_id,
        tenant_id=req.tenant_id,
        requested_field_paths=req.requested_field_paths,
    )

    # ADR-003 grounding gate — non-negotiable.
    validated = validate_grounding(req.document_text, raw_output["facts"])

    return ExtractResponse(
        document_id=req.document_id,
        tenant_id=req.tenant_id,
        extracted_at=raw_output["extracted_at"],
        model_version=raw_output["model_version"],
        facts=validated.facts,
        refusals=raw_output.get("refusals", []),
        grounding_validation={
            "is_clean": validated.is_clean,
            "downgrade_count": validated.downgrade_count,
            "failures": [
                {"fact_id": f.fact_id, "field_path": f.field_path, "reason": f.reason, "severity": f.severity}
                for f in validated.failures
            ],
        },
    )
