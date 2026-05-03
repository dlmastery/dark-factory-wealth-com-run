"""Golden-dataset test for RULE-FET-OBBBA-2026.

Per ADR-001 + DOD-3: every change to federal_estate_tax_obbba.py requires a
re-run of this test with 100% pass on the golden dataset. RALPH 5-loop record
must include this test execution evidence.

Run:
    pytest apps/calc-engine/tests/test_federal_estate_tax_obbba.py -v
"""

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path

import pytest

from app.rules.federal_estate_tax_obbba import (
    FederalEstateTaxInputs,
    compute_federal_estate_tax,
)

GOLDEN_PATH = Path(__file__).parent / "golden" / "obbba_baseline.json"


def _load_golden() -> dict:
    return json.loads(GOLDEN_PATH.read_text(encoding="utf-8"))


def _decimalize(d: dict) -> dict:
    return {k: Decimal(str(v)) for k, v in d.items()}


@pytest.mark.parametrize("case", _load_golden()["cases"], ids=lambda c: c["id"])
def test_golden_case(case: dict) -> None:
    inputs = FederalEstateTaxInputs(**_decimalize(case["inputs"]))
    result = compute_federal_estate_tax(inputs)

    expected = case["expected"]
    if "taxable_estate" in expected:
        assert result.taxable_estate == Decimal(expected["taxable_estate"]), (
            f"{case['id']} taxable_estate mismatch"
        )
    if "federal_estate_tax" in expected:
        assert result.federal_estate_tax == Decimal(expected["federal_estate_tax"]), (
            f"{case['id']} federal_estate_tax mismatch"
        )

    # Every result MUST carry rule_id + citation + computation_version (ADR-001)
    assert result.rule_id == "RULE-FET-OBBBA-2026"
    assert "OBBBA" in result.citation
    assert result.computation_version.startswith("2026.")


@pytest.mark.parametrize(
    "case", _load_golden()["negative_cases"], ids=lambda c: c["id"]
)
def test_negative_case(case: dict) -> None:
    inputs_kwargs = _decimalize(case["inputs"])
    expected_error = case["expects_error"]
    err = {"ValueError": ValueError, "TypeError": TypeError}[expected_error]

    with pytest.raises(err):
        compute_federal_estate_tax(FederalEstateTaxInputs(**inputs_kwargs))


def test_purity_no_side_effects() -> None:
    """Same inputs → same outputs. No randomness. No time dependence."""
    inputs = FederalEstateTaxInputs(gross_estate=Decimal("20000000"))
    a = compute_federal_estate_tax(inputs)
    b = compute_federal_estate_tax(inputs)
    assert a.federal_estate_tax == b.federal_estate_tax
    assert a.taxable_estate == b.taxable_estate
    assert a.computation_version == b.computation_version


def test_breakdown_completeness() -> None:
    """Per ADR-001: every result has a full breakdown for auditability."""
    inputs = FederalEstateTaxInputs(
        gross_estate=Decimal("20000000"),
        debts=Decimal("100000"),
        dsue_amount=Decimal("5000000"),
    )
    result = compute_federal_estate_tax(inputs)
    expected_keys = {
        "gross_estate",
        "total_deductions",
        "adjusted_gross_estate",
        "base_exemption_2026",
        "dsue_amount",
        "available_exemption",
        "taxable_estate",
        "top_rate",
        "federal_estate_tax",
    }
    assert set(result.breakdown.keys()) == expected_keys
