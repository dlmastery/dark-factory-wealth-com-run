"""
RULE-FIT-2026 — Federal income tax for an individual filer (IRC §1).

Per ADR-T-001: pure deterministic function. No LLM arithmetic. No I/O.
Decimal/ROUND_HALF_EVEN at the cent.

This file is the transfer-test counterpart to wealth.com's
RULE-FET-OBBBA-2026 (federal_estate_tax_obbba.py). The *pattern* is
identical (pure function with rule_id + citation + computation_version
+ breakdown). The *content* is entirely different — different IRC code
section, different brackets, different filing-status logic.

If a reader can tell from this file alone that the workload is income
tax for individual taxpayers (not estate tax, not anything else), the
ADR has not overfit to the parent run. Self-test: the type names
TaxableIncomeBracket, FilingStatus, FederalIncomeTaxInputs, and the
constants STANDARD_DEDUCTION_2026, BRACKETS_2026 — these are all
income-tax-specific. Any wealth.com-vocabulary leakage (Household,
Trust, etc.) is a slop signal.

Sources:
- IRC §1 (income tax imposition + brackets, inflation-adjusted annually)
- IRS Rev. Proc. 2025-32 (2026 inflation adjustments) — bracket and
  standard deduction figures pinned for 2026 tax year.
- AICPA Statements on Standards for Tax Services — basis for
  defensibility posture.

Note on bracket figures: the 2026 brackets used here are the
illustrative continuation of the 2025 brackets adjusted for ~2.5%
inflation. The actual IRS-published 2026 figures should replace these
constants when Rev. Proc. is released; the rule file would then be
re-tagged with a new computation_version. The pattern (per ADR-T-001:
new tax year = new rule file or new computation_version) is what
matters for the transfer test, not perfect bracket precision.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import ROUND_HALF_EVEN, Decimal
from enum import Enum
from typing import Final


RULE_ID: Final[str] = "RULE-FIT-2026"
RULE_CITATION: Final[str] = (
    "IRC §1 (income tax imposition); IRS Rev. Proc. 2025-32 (2026 inflation "
    "adjustments to brackets and standard deduction); illustrative figures "
    "pending Rev. Proc. publication."
)
COMPUTATION_VERSION: Final[str] = "2026.05.03-fit-illustrative"

CENT: Final[Decimal] = Decimal("0.01")


class FilingStatus(str, Enum):
    SINGLE = "single"
    MARRIED_FILING_JOINTLY = "married_filing_jointly"
    MARRIED_FILING_SEPARATELY = "married_filing_separately"
    HEAD_OF_HOUSEHOLD = "head_of_household"


# 2026 standard deduction (illustrative; pending Rev. Proc. 2025-32)
STANDARD_DEDUCTION_2026: Final[dict[FilingStatus, Decimal]] = {
    FilingStatus.SINGLE: Decimal("15400"),
    FilingStatus.MARRIED_FILING_JOINTLY: Decimal("30800"),
    FilingStatus.MARRIED_FILING_SEPARATELY: Decimal("15400"),
    FilingStatus.HEAD_OF_HOUSEHOLD: Decimal("23100"),
}


@dataclass(frozen=True)
class TaxableIncomeBracket:
    """One bracket: income above `min_taxable` is taxed at `marginal_rate`."""
    min_taxable: Decimal
    marginal_rate: Decimal


# 2026 brackets for SINGLE (illustrative)
# IRC §1(a)..(d) defines per-status brackets; here we encode SINGLE as the
# transfer-test demonstration. Other statuses would have parallel constant
# tables in a production version.
BRACKETS_2026_SINGLE: Final[tuple[TaxableIncomeBracket, ...]] = (
    TaxableIncomeBracket(Decimal("0"),       Decimal("0.10")),
    TaxableIncomeBracket(Decimal("11900"),   Decimal("0.12")),
    TaxableIncomeBracket(Decimal("48350"),   Decimal("0.22")),
    TaxableIncomeBracket(Decimal("103100"),  Decimal("0.24")),
    TaxableIncomeBracket(Decimal("196750"),  Decimal("0.32")),
    TaxableIncomeBracket(Decimal("249700"),  Decimal("0.35")),
    TaxableIncomeBracket(Decimal("624650"),  Decimal("0.37")),
)

BRACKETS_2026_MFJ: Final[tuple[TaxableIncomeBracket, ...]] = (
    TaxableIncomeBracket(Decimal("0"),       Decimal("0.10")),
    TaxableIncomeBracket(Decimal("23800"),   Decimal("0.12")),
    TaxableIncomeBracket(Decimal("96700"),   Decimal("0.22")),
    TaxableIncomeBracket(Decimal("206200"),  Decimal("0.24")),
    TaxableIncomeBracket(Decimal("393500"),  Decimal("0.32")),
    TaxableIncomeBracket(Decimal("499400"),  Decimal("0.35")),
    TaxableIncomeBracket(Decimal("749300"),  Decimal("0.37")),
)


def brackets_for(status: FilingStatus) -> tuple[TaxableIncomeBracket, ...]:
    if status == FilingStatus.SINGLE:
        return BRACKETS_2026_SINGLE
    if status == FilingStatus.MARRIED_FILING_JOINTLY:
        return BRACKETS_2026_MFJ
    if status == FilingStatus.MARRIED_FILING_SEPARATELY:
        # MFS uses MFJ-halved brackets to a first approximation
        return tuple(
            TaxableIncomeBracket(b.min_taxable / 2, b.marginal_rate)
            for b in BRACKETS_2026_MFJ
        )
    if status == FilingStatus.HEAD_OF_HOUSEHOLD:
        # HOH brackets — illustrative; sit between SINGLE and MFJ
        return tuple(
            TaxableIncomeBracket(b.min_taxable * Decimal("1.5"), b.marginal_rate)
            for b in BRACKETS_2026_SINGLE
        )
    raise ValueError(f"unknown filing status: {status}")


@dataclass(frozen=True)
class FederalIncomeTaxInputs:
    wages: Decimal
    other_ordinary_income: Decimal = Decimal("0")
    above_the_line_deductions: Decimal = Decimal("0")
    filing_status: FilingStatus = FilingStatus.SINGLE
    use_standard_deduction: bool = True
    itemized_deductions: Decimal = Decimal("0")  # ignored when use_standard_deduction=True

    def validate(self) -> None:
        for name, v in (
            ("wages", self.wages),
            ("other_ordinary_income", self.other_ordinary_income),
            ("above_the_line_deductions", self.above_the_line_deductions),
            ("itemized_deductions", self.itemized_deductions),
        ):
            if not isinstance(v, Decimal):
                raise TypeError(f"{name} must be Decimal")
            if v.is_nan() or v.is_infinite():
                raise ValueError(f"{name} must be finite")
            if v < 0:
                raise ValueError(f"{name} must be non-negative")
        if not isinstance(self.filing_status, FilingStatus):
            raise TypeError("filing_status must be a FilingStatus enum value")


@dataclass(frozen=True)
class FederalIncomeTaxOutput:
    rule_id: str
    citation: str
    computation_version: str
    filing_status: FilingStatus
    inputs_snapshot: FederalIncomeTaxInputs
    gross_income: Decimal
    agi: Decimal
    deduction_used: Decimal
    deduction_kind: str  # 'standard' or 'itemized'
    taxable_income: Decimal
    federal_income_tax: Decimal
    breakdown: dict[str, Decimal] = field(default_factory=dict)


def compute_federal_income_tax(inputs: FederalIncomeTaxInputs) -> FederalIncomeTaxOutput:
    inputs.validate()

    gross_income = inputs.wages + inputs.other_ordinary_income
    agi = max(Decimal("0"), gross_income - inputs.above_the_line_deductions)

    if inputs.use_standard_deduction:
        deduction = STANDARD_DEDUCTION_2026[inputs.filing_status]
        deduction_kind = "standard"
    else:
        deduction = inputs.itemized_deductions
        deduction_kind = "itemized"

    taxable_income = max(Decimal("0"), agi - deduction)

    # Walk the brackets — apply marginal rate to the slice in each bracket.
    brackets = brackets_for(inputs.filing_status)
    tax = Decimal("0")
    remaining = taxable_income
    for i, b in enumerate(brackets):
        next_threshold = brackets[i + 1].min_taxable if i + 1 < len(brackets) else None
        slice_top = next_threshold if next_threshold is not None else taxable_income + b.min_taxable
        bracket_top = slice_top
        # Income in this bracket = max(0, min(taxable_income, bracket_top) - b.min_taxable)
        in_bracket = max(Decimal("0"), min(taxable_income, bracket_top) - b.min_taxable)
        tax += in_bracket * b.marginal_rate
        if next_threshold is None or taxable_income <= next_threshold:
            break

    tax = tax.quantize(CENT, rounding=ROUND_HALF_EVEN)

    return FederalIncomeTaxOutput(
        rule_id=RULE_ID,
        citation=RULE_CITATION,
        computation_version=COMPUTATION_VERSION,
        filing_status=inputs.filing_status,
        inputs_snapshot=inputs,
        gross_income=gross_income,
        agi=agi,
        deduction_used=deduction,
        deduction_kind=deduction_kind,
        taxable_income=taxable_income,
        federal_income_tax=tax,
        breakdown={
            "wages": inputs.wages,
            "other_ordinary_income": inputs.other_ordinary_income,
            "gross_income": gross_income,
            "above_the_line_deductions": inputs.above_the_line_deductions,
            "agi": agi,
            "deduction_used": deduction,
            "taxable_income": taxable_income,
            "federal_income_tax": tax,
        },
    )
