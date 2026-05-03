"""Golden + negative tests for RULE-FIT-2026.

Pattern transferred from RUN-WEALTHCOM-001 (test_federal_estate_tax_obbba.py)
— same parametrize-over-golden-JSON shape; different rule content.
"""

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path

import pytest

from tax_mini.rules.federal_income_tax_2026 import (
    FederalIncomeTaxInputs,
    FilingStatus,
    compute_federal_income_tax,
)

GOLDEN_PATH = Path(__file__).parent / "golden" / "federal_income_tax_2026.json"


def _load() -> dict:
    return json.loads(GOLDEN_PATH.read_text(encoding="utf-8"))


def _decimalize(d: dict) -> dict:
    out: dict[str, object] = {}
    for k, v in d.items():
        if k == "filing_status":
            out[k] = FilingStatus(v)
        elif k == "use_standard_deduction":
            out[k] = bool(v)
        else:
            out[k] = Decimal(str(v))
    return out


@pytest.mark.parametrize("case", _load()["cases"], ids=lambda c: c["id"])
def test_golden_case(case: dict) -> None:
    inputs = FederalIncomeTaxInputs(**_decimalize(case["inputs"]))
    result = compute_federal_income_tax(inputs)

    if "expected_agi" in case:
        assert result.agi == Decimal(case["expected_agi"]), f"{case['id']} agi"
    if "expected_taxable_income" in case:
        assert result.taxable_income == Decimal(case["expected_taxable_income"]), (
            f"{case['id']} taxable_income (got {result.taxable_income})"
        )
    if "expected_tax" in case:
        assert result.federal_income_tax == Decimal(case["expected_tax"]), (
            f"{case['id']} tax (got {result.federal_income_tax})"
        )
    if "expected_tax_lt" in case:
        assert result.federal_income_tax < Decimal(case["expected_tax_lt"]), (
            f"{case['id']} tax should be < {case['expected_tax_lt']} (got {result.federal_income_tax})"
        )
    if "expected_deduction_kind" in case:
        assert result.deduction_kind == case["expected_deduction_kind"]

    # Per ADR-T-001: every result MUST carry rule_id + citation + computation_version
    assert result.rule_id == "RULE-FIT-2026"
    assert "IRC" in result.citation
    assert result.computation_version.startswith("2026.")


def test_negative_wages_rejected() -> None:
    with pytest.raises(ValueError):
        compute_federal_income_tax(
            FederalIncomeTaxInputs(wages=Decimal("-1"), filing_status=FilingStatus.SINGLE)
        )


def test_invalid_filing_status_at_enum_boundary() -> None:
    with pytest.raises(ValueError):
        FilingStatus("totally_made_up_status")


def test_purity_no_side_effects() -> None:
    """Same inputs → same outputs. Per ADR-T-001 (transferred from ADR-001)."""
    a = compute_federal_income_tax(FederalIncomeTaxInputs(wages=Decimal("50000"), filing_status=FilingStatus.SINGLE))
    b = compute_federal_income_tax(FederalIncomeTaxInputs(wages=Decimal("50000"), filing_status=FilingStatus.SINGLE))
    assert a.federal_income_tax == b.federal_income_tax
    assert a.taxable_income == b.taxable_income
