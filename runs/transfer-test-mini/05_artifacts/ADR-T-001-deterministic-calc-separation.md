# ADR-T-001 · Deterministic-Calc Separation (TaxBaseline Mini)

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-TRANSFER-001
**Parent pattern:** ADR-001 from RUN-WEALTHCOM-001 (the *pattern* transfers; the *content* differs)

## Why this exists as a separate ADR (not a pointer to ADR-001)

The dark-factory's anti-overfit discipline requires that ADRs be workload-specific. ADR-001 had concrete clauses about *estate* tax, the §7520 rate, GRATs, and OBBBA exemption — none of which apply here. Reading ADR-001 will not tell a TaxBaseline Mini reviewer what to do; reading ADR-T-001 must.

The shared element is the **pattern**: AI does not perform regulated-domain arithmetic; deterministic rules in code do, with citations.

## Context

TaxBaseline Mini computes federal income tax under IRC §1 for individual taxpayers. The 2026 brackets, standard deduction, and filing-status rules are public, deterministic, and changeable only by Congress. A CPA using this tool must be able to defend every dollar of the computation in audit.

Forces:
- **Professional liability:** A CPA who issues a return with an arithmetic error owes restitution + may face AICPA discipline. Indistinguishable in severity from a fiduciary error.
- **Audit defensibility:** Substantiating tax computations is a core CPA workflow. "The tool said so" is not defensible.
- **OBBBA-style legislative drift:** Income tax brackets adjust annually for inflation; major changes (e.g., TCJA 2017, OBBBA 2025) happen periodically. Pinning the rule library to a year + computation_version is required.

## Decision

**TaxBaseline Mini's calc rules are pure functions. No LLM arithmetic. Every output carries `rule_id`, `citation` (IRC section), and `computation_version`.**

The same architectural separation that ADR-001 mandated for estate tax: extraction (if applicable) is one service; computation is a separate, deterministic service. They communicate via a typed JSON contract.

For TaxBaseline Mini at this scope:
- The calc layer is a Python module `tax_mini.rules.federal_income_tax_2026`.
- Pure functions; Decimal arithmetic with `ROUND_HALF_EVEN` quantization.
- Each function returns a result object including `rule_id`, `citation`, `computation_version`, and a full `breakdown` dict for audit.
- Future legislative change → NEW rule file (e.g., `federal_income_tax_2027.py`) — never mutate the prior year's rule. The `computation_version` field surfaces the version on the output.

## Consequences

### Positive
- **Audit defensibility.** Every dollar traces to a `rule_id` + IRC citation + golden-test that passed.
- **Year-over-year correctness.** New tax year = new rule file = old rule file's behavior is frozen.
- **No LLM hallucination of brackets.** The thresholds are encoded as constants, not generated.

### Negative / Cost
- **More files per tax year** than a single-file approach. Acceptable; immutability is the value.

## Pattern lineage (transfer-test traceability)

| Element | ADR-001 (parent) | ADR-T-001 (this) | Transferred? |
|---|---|---|---|
| Architectural pattern: "AI does not do math" | yes | yes | ✅ pattern |
| Decimal/ROUND_HALF_EVEN posture | yes | yes | ✅ pattern |
| `rule_id` + `citation` + `computation_version` on every output | yes | yes | ✅ pattern |
| Pure functions, no I/O in rule layer | yes | yes | ✅ pattern |
| Concrete law: OBBBA federal **estate** tax 2026 §2001 + §2010(c) | yes | n/a | ❌ content (correctly NOT transferred) |
| Concrete law: §7520 rate, GRAT mechanics, Walton zeroed-out | yes | n/a | ❌ content |
| Concrete law: IRC §1 federal **income** tax brackets 2026 | n/a | yes | ❌ different content |
| Concrete law: Standard deduction, filing-status logic | n/a | yes | ❌ different content |

**Test of this transfer:** A reader who reads only this ADR (without ADR-001) should immediately know the workload is **federal income tax for individual taxpayers under IRC §1**, not estate tax. If they cannot, this ADR has overfit to its parent.

## Verification

- `runs/transfer-test-mini/app/apps/tax-mini/tax_mini/rules/federal_income_tax_2026.py` is a pure-function module (no I/O imports beyond `decimal`, `dataclasses`, `typing`).
- `runs/transfer-test-mini/app/apps/tax-mini/tests/test_federal_income_tax.py` has parametrized golden tests with ≥10 cases.
- `runs/transfer-test-mini/app/apps/tax-mini/tests/golden/federal_income_tax_2026.json` is the golden dataset.
- CI grep over `runs/transfer-test-mini/app/` returns zero matches for the wealth.com forbidden-token list (Household, Trust, GRAT, ..., Sage).

## Trace links

- Parent pattern: `runs/wealth-com/05_artifacts/ADR-001-deterministic-calc-separation.md`
- Source: ATTR-TRANSFER-001 §non_negotiable_constraints_locked_in
- Implements: PRODUCT-TAILORING-TRANSFER-001 §risk_profile.safety + .money + .compliance
- Implemented by: `tax_mini/rules/federal_income_tax_2026.py`
- Verified by: golden dataset + parametrized pytest + adversarial generic-process review
