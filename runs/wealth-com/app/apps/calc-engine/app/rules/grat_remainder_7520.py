"""
RULE-GRAT-7520-2026 — Walton zeroed-out GRAT valuation under IRC §7520.

Per ADR-001: pure function, no LLM. Decimal arithmetic.
Per DDD-001: GRAT = Grantor Retained Annuity Trust (IRC §2702).

A "Walton" or zeroed-out GRAT structures the retained annuity such that the
present value of the annuity stream equals the contributed principal — i.e.,
the gift-tax value of the remainder interest is approximately zero. Whatever
appreciation exceeds the §7520 rate over the GRAT term passes to the
remainder beneficiaries free of additional gift / estate tax.

Math:
    annuity_factor(r, n)   = (1 - (1+r)^(-n)) / r              # ordinary annuity, end-of-period
    annuity_payment        = principal / annuity_factor          # zeroed-out
    project balance year-by-year:
        balance_0 = principal
        balance_t = balance_{t-1} * (1 + g) - annuity_payment   # end-of-year payment
    remainder_at_term       = balance_n  (if >= 0; else 0; "GRAT failed")
    gift_tax_value_at_funding = principal - PV(annuity_at_r) ≈ 0 (zeroed)

The gift-tax value at funding is effectively zero because the annuity stream
is engineered to equal principal at the §7520 rate. Any growth above r is the
"transferred remainder" — the policy lever GRATs exploit.

Inputs are validated:
    - principal > 0
    - 0 < r < 1
    - 0 < g < 1   (g may be ≤ r — GRAT just doesn't transfer wealth in that case)
    - 1 ≤ n ≤ 30  (n=0 doesn't make sense; n>30 is unusual and we cap to surface
                   anomalies rather than silently process)

Source citations:
    - IRC §7520 — valuation tables, monthly published rate.
    - IRC §2702 — special valuation rules for transfers in trust.
    - Walton v. Commissioner, 115 T.C. 589 (2000) — established the zeroed-out
      GRAT shape we model here.

Note on the §7520 rate: this code does NOT fetch the IRS-published rate.
The caller passes the rate that was published for the funding month. v0
ships with a per-environment default in main.py (CALC_DEFAULT_7520_RATE)
that reflects the rate when this run was authored; production deployment
would integrate an IRS rate-table service.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import ROUND_HALF_EVEN, Decimal, getcontext
from typing import Final

# Use a wide enough precision for compound-interest math without losing the cent.
getcontext().prec = 28

RULE_ID: Final[str] = "RULE-GRAT-7520-2026"
RULE_CITATION: Final[str] = (
    "IRC §7520 (valuation tables); IRC §2702 (special valuation rules for transfers in trust); "
    "Walton v. Commissioner, 115 T.C. 589 (2000) — zeroed-out GRAT shape."
)
COMPUTATION_VERSION: Final[str] = "2026.05.03-GRAT-baseline"

CENT: Final[Decimal] = Decimal("0.01")
MAX_TERM_YEARS: Final[int] = 30
# When the final annuity payment exceeds the balance by less than a dollar, it
# is a rounding artifact of cent-quantized annuity arithmetic, not an economic
# failure. The g=r breakeven case lands here. Treat as zero remainder, not failed.
ROUNDING_TOLERANCE_DOLLARS: Final[Decimal] = Decimal("1.00")


@dataclass(frozen=True)
class GRATInputs:
    principal: Decimal
    section_7520_rate: Decimal     # e.g., Decimal("0.052") for 5.20%
    projected_growth_rate: Decimal  # e.g., Decimal("0.08") for 8%
    term_years: int

    def validate(self) -> None:
        for name, v in (
            ("principal", self.principal),
            ("section_7520_rate", self.section_7520_rate),
            ("projected_growth_rate", self.projected_growth_rate),
        ):
            if not isinstance(v, Decimal):
                raise TypeError(f"{name} must be Decimal")
            if v.is_nan() or v.is_infinite():
                raise ValueError(f"{name} must be finite")
        if self.principal <= 0:
            raise ValueError("principal must be > 0")
        if not (Decimal("0") < self.section_7520_rate < Decimal("1")):
            raise ValueError("section_7520_rate must be in (0, 1)")
        if not (Decimal("0") < self.projected_growth_rate < Decimal("1")):
            raise ValueError("projected_growth_rate must be in (0, 1)")
        if not (1 <= self.term_years <= MAX_TERM_YEARS):
            raise ValueError(f"term_years must be in [1, {MAX_TERM_YEARS}]")


@dataclass(frozen=True)
class GRATYearProjection:
    year: int
    opening_balance: Decimal
    growth: Decimal
    annuity_payment: Decimal
    closing_balance: Decimal


@dataclass(frozen=True)
class GRATOutput:
    rule_id: str
    citation: str
    computation_version: str
    inputs_snapshot: GRATInputs
    annuity_factor: Decimal           # (1 - (1+r)^-n) / r
    annual_annuity_payment: Decimal    # zeroed-out
    total_annuity_paid: Decimal        # = annuity * n
    projection: list[GRATYearProjection]
    remainder_at_term: Decimal
    grat_failed: bool                  # True when balance went negative pre-term
    gift_tax_value_at_funding: Decimal  # zeroed-out → ~ $0
    breakdown: dict[str, Decimal] = field(default_factory=dict)


def _pow_decimal(base: Decimal, exponent: int) -> Decimal:
    """Decimal exponentiation by integer (positive or negative)."""
    if exponent == 0:
        return Decimal("1")
    if exponent > 0:
        result = Decimal("1")
        for _ in range(exponent):
            result *= base
        return result
    # negative
    return Decimal("1") / _pow_decimal(base, -exponent)


def compute_grat_remainder(inputs: GRATInputs) -> GRATOutput:
    """Pure function. No I/O. Caller persists ComputationTrace per ADR-001."""
    inputs.validate()

    r = inputs.section_7520_rate
    g = inputs.projected_growth_rate
    n = inputs.term_years
    P = inputs.principal

    one_plus_r = Decimal("1") + r
    annuity_factor = (Decimal("1") - _pow_decimal(one_plus_r, -n)) / r
    annual_annuity = (P / annuity_factor).quantize(CENT, rounding=ROUND_HALF_EVEN)

    projection: list[GRATYearProjection] = []
    balance = P
    grat_failed = False
    for year in range(1, n + 1):
        opening = balance
        growth = (opening * g).quantize(CENT, rounding=ROUND_HALF_EVEN)
        balance_after_growth = opening + growth
        balance = balance_after_growth - annual_annuity
        if balance < 0:
            # Tolerance: rounding-level shortfalls (within a dollar) on the last
            # year are not economic failures — they're cent-quantization noise.
            if year == n and balance >= -ROUNDING_TOLERANCE_DOLLARS:
                balance = Decimal("0")
                projection.append(
                    GRATYearProjection(
                        year=year,
                        opening_balance=opening,
                        growth=growth,
                        annuity_payment=annual_annuity,
                        closing_balance=Decimal("0"),
                    )
                )
                break
            grat_failed = True
            balance = Decimal("0")
            projection.append(
                GRATYearProjection(
                    year=year,
                    opening_balance=opening,
                    growth=growth,
                    annuity_payment=balance_after_growth,  # last partial payment exhausts the GRAT
                    closing_balance=Decimal("0"),
                )
            )
            # Subsequent years receive nothing.
            for skipped_year in range(year + 1, n + 1):
                projection.append(
                    GRATYearProjection(
                        year=skipped_year,
                        opening_balance=Decimal("0"),
                        growth=Decimal("0"),
                        annuity_payment=Decimal("0"),
                        closing_balance=Decimal("0"),
                    )
                )
            break
        projection.append(
            GRATYearProjection(
                year=year,
                opening_balance=opening,
                growth=growth,
                annuity_payment=annual_annuity,
                closing_balance=balance,
            )
        )

    remainder = balance.quantize(CENT, rounding=ROUND_HALF_EVEN)
    total_paid = sum((p.annuity_payment for p in projection), Decimal("0")).quantize(
        CENT, rounding=ROUND_HALF_EVEN
    )
    gift_tax_value_at_funding = Decimal("0.00")  # by construction (zeroed-out)

    return GRATOutput(
        rule_id=RULE_ID,
        citation=RULE_CITATION,
        computation_version=COMPUTATION_VERSION,
        inputs_snapshot=inputs,
        annuity_factor=annuity_factor,
        annual_annuity_payment=annual_annuity,
        total_annuity_paid=total_paid,
        projection=projection,
        remainder_at_term=remainder,
        grat_failed=grat_failed,
        gift_tax_value_at_funding=gift_tax_value_at_funding,
        breakdown={
            "principal": P,
            "section_7520_rate": r,
            "projected_growth_rate": g,
            "term_years": Decimal(n),
            "annuity_factor": annuity_factor,
            "annual_annuity_payment": annual_annuity,
            "total_annuity_paid": total_paid,
            "remainder_at_term": remainder,
            "gift_tax_value_at_funding": gift_tax_value_at_funding,
        },
    )
