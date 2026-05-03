"""Golden tests for RULE-GRAT-7520-2026 + scenario tests for SCENARIO-GRAT-VS-DONOTHING-2026."""

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path

import pytest

from app.rules.grat_remainder_7520 import GRATInputs, compute_grat_remainder
from app.rules.grat_vs_donothing_scenario import (
    GRATScenarioInputs,
    compute_grat_vs_donothing,
)

GOLDEN_PATH = Path(__file__).parent / "golden" / "grat_cases.json"


def _decimalize(d: dict) -> dict:
    return {k: (int(v) if k == "term_years" else Decimal(str(v))) for k, v in d.items()}


def _load() -> dict:
    return json.loads(GOLDEN_PATH.read_text(encoding="utf-8"))


@pytest.mark.parametrize("case", _load()["cases"], ids=lambda c: c["id"])
def test_grat_golden_case(case: dict) -> None:
    inputs = GRATInputs(**_decimalize(case["inputs"]))
    out = compute_grat_remainder(inputs)
    expected = case["expected"]
    if "annual_annuity_payment" in expected:
        assert out.annual_annuity_payment == Decimal(expected["annual_annuity_payment"]), (
            f"{case['id']} annuity mismatch: got {out.annual_annuity_payment}"
        )
    if "remainder_at_term" in expected:
        assert out.remainder_at_term == Decimal(expected["remainder_at_term"]), (
            f"{case['id']} remainder mismatch: got {out.remainder_at_term}"
        )
    if "grat_failed" in expected:
        assert out.grat_failed == expected["grat_failed"], f"{case['id']} grat_failed mismatch"
    assert out.remainder_at_term >= 0
    assert out.gift_tax_value_at_funding == Decimal("0.00")  # always zeroed-out
    assert out.rule_id == "RULE-GRAT-7520-2026"


@pytest.mark.parametrize("case", _load()["negative_cases"], ids=lambda c: c["id"])
def test_grat_negative_case(case: dict) -> None:
    err = {"ValueError": ValueError, "TypeError": TypeError}[case["expects_error"]]
    with pytest.raises(err):
        compute_grat_remainder(GRATInputs(**_decimalize(case["inputs"])))


def test_grat_purity() -> None:
    """Same inputs → identical outputs."""
    i = GRATInputs(
        principal=Decimal("5000000"),
        section_7520_rate=Decimal("0.052"),
        projected_growth_rate=Decimal("0.08"),
        term_years=5,
    )
    a = compute_grat_remainder(i)
    b = compute_grat_remainder(i)
    assert a.remainder_at_term == b.remainder_at_term
    assert a.annual_annuity_payment == b.annual_annuity_payment


# --- Scenario: GRAT vs do-nothing for $20M Doe Family ---------------------------


def test_grat_scenario_doe_family_demo() -> None:
    """The headline Demo MVP scenario per CC-001: $20M household, $5M GRAT,
    5.2% §7520, 8% growth, 5-year term, no DSUE.
    """
    inputs = GRATScenarioInputs(
        total_estate_at_year_zero=Decimal("20000000"),
        grat_principal=Decimal("5000000"),
        section_7520_rate=Decimal("0.052"),
        projected_growth_rate=Decimal("0.08"),
        term_years=5,
    )
    result = compute_grat_vs_donothing(inputs)

    # GRAT path should not have failed at these inputs.
    assert not result.grat_failed
    # GRAT path should transfer something outside the estate.
    assert result.grat_path.transferred_to_beneficiaries_outside_estate > 0
    # Do-nothing path has nothing outside the estate.
    assert result.do_nothing_path.transferred_to_beneficiaries_outside_estate == Decimal("0.00")
    # Both paths above OBBBA $15M exemption → both have non-zero federal estate tax.
    assert result.grat_path.federal_estate_tax > 0
    assert result.do_nothing_path.federal_estate_tax > 0
    # Tax savings should be positive (GRAT removes appreciation from the estate).
    assert result.tax_savings > 0
    # Notes must include the educational disclaimer (HD-007 + ADR-003).
    assert any("EDUCATIONAL PROJECTION ONLY" in n for n in result.notes)


def test_grat_scenario_low_growth_warns() -> None:
    """When growth ≤ §7520 rate, scenario must surface the warning note."""
    inputs = GRATScenarioInputs(
        total_estate_at_year_zero=Decimal("20000000"),
        grat_principal=Decimal("5000000"),
        section_7520_rate=Decimal("0.05"),
        projected_growth_rate=Decimal("0.04"),
        term_years=5,
    )
    result = compute_grat_vs_donothing(inputs)
    assert any("growth ≤ §7520" in n.lower() or "do-nothing may even be preferred" in n for n in result.notes)


def test_grat_scenario_principal_too_large_rejected() -> None:
    inputs = GRATScenarioInputs(
        total_estate_at_year_zero=Decimal("5000000"),
        grat_principal=Decimal("10000000"),  # > total
        section_7520_rate=Decimal("0.05"),
        projected_growth_rate=Decimal("0.08"),
        term_years=5,
    )
    with pytest.raises(ValueError):
        compute_grat_vs_donothing(inputs)


def test_grat_scenario_uses_obbba_exemption() -> None:
    """Sanity: federal estate tax in both paths reflects OBBBA $15M, not TCJA $7M."""
    # An estate that would be taxable at $7M but not at $15M.
    inputs = GRATScenarioInputs(
        total_estate_at_year_zero=Decimal("8000000"),
        grat_principal=Decimal("1000000"),
        section_7520_rate=Decimal("0.05"),
        projected_growth_rate=Decimal("0.04"),  # low growth → minimal compounding
        term_years=1,
    )
    result = compute_grat_vs_donothing(inputs)
    # Even compounded, $8M @ 4% × 1y = $8.32M < $15M OBBBA exemption → zero tax.
    assert result.do_nothing_path.federal_estate_tax == Decimal("0.00"), (
        "If this fails, calc-engine is using pre-OBBBA exemption — regression alert."
    )
