"""
SCENARIO-GRAT-VS-DONOTHING-2026 — the Demo MVP scenario per CC-001.

Compares two paths for a $20M household funding $5M of a GRAT vs. doing nothing:

  GRAT path:
    - Year 0: grantor funds GRAT with `grat_principal` from existing assets.
      Gift-tax value at funding = $0 (zeroed-out per RULE-GRAT-7520-2026).
    - Years 1..n: GRAT pays grantor annual annuity; remaining assets grow.
    - Year n: GRAT remainder transfers to beneficiaries free of estate/gift tax.
    - Grantor still holds: starting principal NOT in GRAT + annuity payments
      received + everything growing at projected_growth_rate.
    - At grantor's death (assumed at end of term n for the comparison),
      the grantor's gross estate is computed and federal estate tax is
      computed under OBBBA via RULE-FET-OBBBA-2026.

  Do-nothing path:
    - Year 0..n: nothing changes; entire estate grows at projected_growth_rate.
    - At end of year n: gross estate is the original total compounded.
    - Federal estate tax under OBBBA computed via RULE-FET-OBBBA-2026.

Output: side-by-side breakdown + tax savings + remainder transferred.

Disclaimer (HD-007 + ADR-003 + UI surface): this is an EDUCATIONAL PROJECTION,
not legal or tax advice. Real GRAT planning requires attorney review.
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_EVEN
from typing import Final

from app.rules.federal_estate_tax_obbba import (
    FederalEstateTaxInputs,
    compute_federal_estate_tax,
)
from app.rules.grat_remainder_7520 import GRATInputs, compute_grat_remainder

SCENARIO_ID: Final[str] = "SCENARIO-GRAT-VS-DONOTHING-2026"
CENT: Final[Decimal] = Decimal("0.01")


@dataclass(frozen=True)
class GRATScenarioInputs:
    """Inputs that describe a household-level GRAT scenario."""
    total_estate_at_year_zero: Decimal
    grat_principal: Decimal
    section_7520_rate: Decimal
    projected_growth_rate: Decimal
    term_years: int
    dsue_amount: Decimal = Decimal("0")  # surviving-spouse portability if applicable

    def validate(self) -> None:
        if self.grat_principal > self.total_estate_at_year_zero:
            raise ValueError("grat_principal cannot exceed total_estate")
        # grat-level validation handled by GRATInputs.validate when constructed


@dataclass(frozen=True)
class PathResult:
    name: str
    gross_estate_at_term: Decimal
    federal_estate_tax: Decimal
    transferred_to_beneficiaries_outside_estate: Decimal  # GRAT remainder; 0 for do-nothing
    net_to_beneficiaries: Decimal                          # estate - tax + outside

    @property
    def label(self) -> str:
        return self.name


@dataclass(frozen=True)
class GRATScenarioOutput:
    scenario_id: str
    inputs_snapshot: GRATScenarioInputs
    grat_path: PathResult
    do_nothing_path: PathResult
    tax_savings: Decimal
    additional_to_beneficiaries: Decimal
    grat_failed: bool
    grat_breakdown: dict
    notes: list[str]


def _compound(amount: Decimal, rate: Decimal, years: int) -> Decimal:
    """Compound `amount` at `rate` for `years` whole years. Quantize at cent."""
    factor = Decimal("1") + rate
    out = amount
    for _ in range(years):
        out = out * factor
    return out.quantize(CENT, rounding=ROUND_HALF_EVEN)


def compute_grat_vs_donothing(inputs: GRATScenarioInputs) -> GRATScenarioOutput:
    inputs.validate()

    notes: list[str] = []
    n = inputs.term_years
    g = inputs.projected_growth_rate
    r = inputs.section_7520_rate

    # --- GRAT path -----------------------------------------------------------
    grat_inputs = GRATInputs(
        principal=inputs.grat_principal,
        section_7520_rate=r,
        projected_growth_rate=g,
        term_years=n,
    )
    grat = compute_grat_remainder(grat_inputs)

    # Grantor's residual assets at year 0 (after funding GRAT).
    grantor_residual_year_zero = inputs.total_estate_at_year_zero - inputs.grat_principal

    # Annuity payments accumulate in grantor's hands. Conservative assumption:
    # annuity payments received are reinvested at the same projected growth rate
    # from the year of receipt to year n. This rolls up the cash flows.
    accumulated_annuity_at_term = Decimal("0")
    for year_proj in grat.projection:
        years_to_term = n - year_proj.year
        compounded = _compound(year_proj.annuity_payment, g, years_to_term)
        accumulated_annuity_at_term += compounded

    grantor_residual_at_term = _compound(grantor_residual_year_zero, g, n)
    grat_path_gross_estate = (grantor_residual_at_term + accumulated_annuity_at_term).quantize(
        CENT, rounding=ROUND_HALF_EVEN
    )

    grat_path_tax_result = compute_federal_estate_tax(
        FederalEstateTaxInputs(
            gross_estate=grat_path_gross_estate,
            dsue_amount=inputs.dsue_amount,
        )
    )

    grat_path_net = (
        grat_path_gross_estate
        - grat_path_tax_result.federal_estate_tax
        + grat.remainder_at_term
    ).quantize(CENT, rounding=ROUND_HALF_EVEN)

    grat_path = PathResult(
        name="GRAT path",
        gross_estate_at_term=grat_path_gross_estate,
        federal_estate_tax=grat_path_tax_result.federal_estate_tax,
        transferred_to_beneficiaries_outside_estate=grat.remainder_at_term,
        net_to_beneficiaries=grat_path_net,
    )

    # --- Do-nothing path -----------------------------------------------------
    donothing_gross_estate = _compound(inputs.total_estate_at_year_zero, g, n)
    donothing_tax_result = compute_federal_estate_tax(
        FederalEstateTaxInputs(
            gross_estate=donothing_gross_estate,
            dsue_amount=inputs.dsue_amount,
        )
    )
    donothing_net = (donothing_gross_estate - donothing_tax_result.federal_estate_tax).quantize(
        CENT, rounding=ROUND_HALF_EVEN
    )

    do_nothing_path = PathResult(
        name="Do-nothing path",
        gross_estate_at_term=donothing_gross_estate,
        federal_estate_tax=donothing_tax_result.federal_estate_tax,
        transferred_to_beneficiaries_outside_estate=Decimal("0.00"),
        net_to_beneficiaries=donothing_net,
    )

    # --- Comparison ----------------------------------------------------------
    tax_savings = (do_nothing_path.federal_estate_tax - grat_path.federal_estate_tax).quantize(
        CENT, rounding=ROUND_HALF_EVEN
    )
    additional_to_beneficiaries = (
        grat_path.net_to_beneficiaries - do_nothing_path.net_to_beneficiaries
    ).quantize(CENT, rounding=ROUND_HALF_EVEN)

    if g <= r:
        notes.append(
            "Projected growth ≤ §7520 rate: GRAT does not transfer wealth in this scenario; "
            "do-nothing may even be preferred on simplicity. Consider higher-growth assets or "
            "a different strategy."
        )
    if grat.grat_failed:
        notes.append(
            "GRAT FAILED: balance went to zero before term end. The annuity payments returned "
            "the principal but no remainder was transferred."
        )
    if not grat.grat_failed and grat.remainder_at_term > Decimal("0"):
        notes.append(
            f"Zeroed-out GRAT transferred ${grat.remainder_at_term:,.2f} to beneficiaries "
            f"outside the estate — this is the policy lever the strategy exploits."
        )
    notes.append(
        "EDUCATIONAL PROJECTION ONLY. This is not legal or tax advice. "
        "Attorney of record must review before implementation. (HD-007 / ADR-003)"
    )

    return GRATScenarioOutput(
        scenario_id=SCENARIO_ID,
        inputs_snapshot=inputs,
        grat_path=grat_path,
        do_nothing_path=do_nothing_path,
        tax_savings=tax_savings,
        additional_to_beneficiaries=additional_to_beneficiaries,
        grat_failed=grat.grat_failed,
        grat_breakdown={k: str(v) for k, v in grat.breakdown.items()},
        notes=notes,
    )
