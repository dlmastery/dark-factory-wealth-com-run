"""
RULE-FET-OBBBA-2026 — Federal estate tax under OBBBA.

Per ADR-001: this is a pure function. No LLM call. No I/O. Inputs in, output
out, with a ComputationTrace recorded by the caller.

Per FACT-OBBBA-001 (domain-brief.md §1):
- The One Big Beautiful Bill Act, signed July 4, 2025, permanently raised the
  federal estate / gift / GST exemption to $15,000,000 per individual for 2026
  (with annual inflation adjustment).
- Top federal estate tax rate remains 40%.
- The TCJA sunset that was scheduled for 12/31/2025 did NOT take effect.
- DSUE portability remains available — surviving spouse may use the unused
  portion of a deceased spouse's exemption (IRC §2010(c)).

Calculation overview:
    gross_estate                  = sum(asset_values_at_dod) + life_insurance
                                  + retirement + jointly_held_share
    deductions                    = funeral + admin + debts + marital + charitable
    adjusted_gross_estate         = gross_estate - deductions
    available_exemption           = base_exemption_2026 + dsue_amount
    taxable_estate                = max(0, adjusted_gross_estate - available_exemption)
    federal_estate_tax            = taxable_estate * top_rate

Notes:
- We use Decimal (not float) for monetary arithmetic. IEEE-754 surprises in
  estate-tax math are unacceptable.
- Inputs are validated. Negative inputs raise. NaN/inf raise.
- The tax bracket structure is a flat 40% above the exemption. (The full IRC
  §2001 graduated bracket schedule maps everything below ~$1M at lower rates,
  but at the OBBBA $15M+ exemption level no taxable estate ever falls into the
  graduated section — the bracket schedule is only relevant for gift tax on
  pre-1976 transfers, irrelevant here. We document this assumption explicitly.)

This rule is governed by:
- Citation: IRC §2001 (estate tax imposition + graduated rates),
            IRC §2010 (unified credit / exemption + DSUE portability),
            OBBBA (2025; permanent exemption increase to $15M for 2026).
- Golden dataset: apps/calc-engine/tests/golden/obbba_baseline.json (≥20 cases per DOD-3).
- Refinery gate: every change to this file requires a re-run of the golden dataset and a RALPH 5-loop record.

If a future amendment changes the exemption or the top rate, supersede via a
new rule file (e.g., federal_estate_tax_post_2027_xyz.py) — DO NOT mutate this
file's behavior. The rule_id and computation_version fields exist for this.
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_EVEN, Decimal
from typing import Final

# ----------------------------------------------------------------------------
# Constants — locked by ADR-001 + FACT-OBBBA-001.
# ----------------------------------------------------------------------------

RULE_ID: Final[str] = "RULE-FET-OBBBA-2026"
RULE_CITATION: Final[str] = (
    "IRC §2001 (estate tax imposition); IRC §2010(c) (unified credit + DSUE portability); "
    "OBBBA — One Big Beautiful Bill Act (Pub. L. 119-12, July 4, 2025) — permanent $15M exemption."
)
COMPUTATION_VERSION: Final[str] = "2026.05.03-OBBBA-baseline"

BASE_EXEMPTION_2026: Final[Decimal] = Decimal("15000000")  # FACT-OBBBA-001
TOP_RATE: Final[Decimal] = Decimal("0.40")  # IRC §2001(c) top bracket

# Numeric quantization for monetary outputs — round half-to-even at the cent.
CENT: Final[Decimal] = Decimal("0.01")


# ----------------------------------------------------------------------------
# Input / Output value objects.
# ----------------------------------------------------------------------------


@dataclass(frozen=True)
class FederalEstateTaxInputs:
    """All amounts in USD."""

    gross_estate: Decimal
    funeral_admin_expenses: Decimal = Decimal("0")
    debts: Decimal = Decimal("0")
    marital_deduction: Decimal = Decimal("0")
    charitable_deduction: Decimal = Decimal("0")
    dsue_amount: Decimal = Decimal("0")  # IRC §2010(c) deceased-spousal-unused-exclusion

    def validate(self) -> None:
        for name, value in (
            ("gross_estate", self.gross_estate),
            ("funeral_admin_expenses", self.funeral_admin_expenses),
            ("debts", self.debts),
            ("marital_deduction", self.marital_deduction),
            ("charitable_deduction", self.charitable_deduction),
            ("dsue_amount", self.dsue_amount),
        ):
            if not isinstance(value, Decimal):
                raise TypeError(f"{name} must be Decimal, got {type(value).__name__}")
            if value.is_nan() or value.is_infinite():
                raise ValueError(f"{name} must be finite, got {value}")
            if value < 0:
                raise ValueError(f"{name} must be non-negative, got {value}")
        # Sanity: gross_estate must cover the deductions claimed against it.
        total_deductions = (
            self.funeral_admin_expenses + self.debts + self.marital_deduction + self.charitable_deduction
        )
        if total_deductions > self.gross_estate:
            raise ValueError(
                f"deductions {total_deductions} exceed gross_estate {self.gross_estate}"
            )


@dataclass(frozen=True)
class FederalEstateTaxOutput:
    rule_id: str
    computation_version: str
    citation: str
    inputs_snapshot: FederalEstateTaxInputs
    adjusted_gross_estate: Decimal
    available_exemption: Decimal
    taxable_estate: Decimal
    federal_estate_tax: Decimal
    breakdown: dict[str, Decimal]


# ----------------------------------------------------------------------------
# The pure function.
# ----------------------------------------------------------------------------


def compute_federal_estate_tax(inputs: FederalEstateTaxInputs) -> FederalEstateTaxOutput:
    """Compute federal estate tax under OBBBA (2026 permanent baseline).

    Pure function. No side effects. No I/O. No LLM calls.
    """
    inputs.validate()

    total_deductions = (
        inputs.funeral_admin_expenses
        + inputs.debts
        + inputs.marital_deduction
        + inputs.charitable_deduction
    )
    adjusted_gross_estate = inputs.gross_estate - total_deductions
    available_exemption = BASE_EXEMPTION_2026 + inputs.dsue_amount
    taxable_estate = max(Decimal("0"), adjusted_gross_estate - available_exemption)
    federal_estate_tax = (taxable_estate * TOP_RATE).quantize(CENT, rounding=ROUND_HALF_EVEN)

    return FederalEstateTaxOutput(
        rule_id=RULE_ID,
        computation_version=COMPUTATION_VERSION,
        citation=RULE_CITATION,
        inputs_snapshot=inputs,
        adjusted_gross_estate=adjusted_gross_estate,
        available_exemption=available_exemption,
        taxable_estate=taxable_estate,
        federal_estate_tax=federal_estate_tax,
        breakdown={
            "gross_estate": inputs.gross_estate,
            "total_deductions": total_deductions,
            "adjusted_gross_estate": adjusted_gross_estate,
            "base_exemption_2026": BASE_EXEMPTION_2026,
            "dsue_amount": inputs.dsue_amount,
            "available_exemption": available_exemption,
            "taxable_estate": taxable_estate,
            "top_rate": TOP_RATE,
            "federal_estate_tax": federal_estate_tax,
        },
    )
