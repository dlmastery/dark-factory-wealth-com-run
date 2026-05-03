# Anti-Overfit Forbidden-Token Grep Protocol

When a meta-meta run includes a transfer test (anti-overfit proof for the dark-factory itself), the canonical evidence is a forbidden-token grep over the transfer-test tree. This protocol codifies how that grep is run and how its results are interpreted, derived from `RUN-TRANSFER-001` (lessons L-002 + L-003).

## Why this exists

A transfer test's purpose is to demonstrate the factory tailors per archetype rather than blanket-applying a prior workload's vocabulary. The naive implementation — `grep -r FORBIDDEN_TOKENS` — produces three categories of match:

1. **Product-code leakage** (true slop): the parent run's vocabulary appears in the new workload's types, constants, rule logic, or tests. *This is what the gate must catch.*
2. **Cross-reference / contrast documentation** (anti-overfit evidence): comments and ADR tables that explicitly say "the parent had X, this run does NOT". *Removing these would weaken the anti-overfit documentation.*
3. **Legitimate domain vocabulary** (false-positive): tokens on the forbidden list that are also valid terminology in the new workload's domain. (Example: "Household" is a wealth.com aggregate root, AND "Head of Household" is an IRC §2(b) tax filing status.)

A protocol that only counts raw matches (and rejects any non-zero count) forces removal of categories 2 and 3, weakening evidence and producing wrong-shaped product code. A protocol that only checks product code (and ignores comments and tables) misses real leakage in inline strings.

## The protocol

### Step 1 — Compose the forbidden-token list per parent run

The list is derived from the parent run's `product-tailoring-profile.json §anti_overfit_rules_for_factory`. Tokens fall into three groups:

- **Brand / marks**: registered names (Ester, Family Office Suite, Heritage Map, EstateFlow, EstateCompass, Sage when applicable).
- **Domain entity vocabulary**: aggregate-root nouns specific to the parent (Household, Trust, Person, Entity).
- **Domain rule vocabulary**: parent-specific rule names (GRAT, SLAT, ILIT, CLAT, Dynasty, OBBBA, distribution_rule).

### Step 2 — Compose the per-archetype allowlist

The new workload's archetype determines which tokens are legitimate domain vocabulary regardless of the forbidden list. Example for the income-tax archetype:

- "Head of Household" — IRC §2(b) filing status
- "household income" — common tax-context phrasing for AGI sums

Each entry has a citation (IRC code section, regulatory reference, or industry-standard usage) so the allowlist itself is anti-slop.

### Step 3 — Run the grep with word boundaries

```bash
grep -rEn '\b(Household|Trust|GRAT|SLAT|ILIT|CLAT|Dynasty|OBBBA|Ester|Sage|Heritage Map|Family Office|EstateFlow|EstateCompass)\b' \
  runs/<transfer-test-run>/{02_attractor,05_artifacts,app}/
```

Word boundaries (`\b`) reduce false positives but do not eliminate them — "household" inside "Head of Household" still matches because both are word-bounded. The allowlist handles the residue.

### Step 4 — Classify every match into one of three categories

For each grep hit, examine the surrounding context and assign:

| Category | Examples | Action |
|---|---|---|
| **Product-code leakage** | `class HouseholdAggregate:` in a tax-baseline tool; `if scenario_type == "GRAT":` in a non-estate workload | **REJECT** — refactor to remove |
| **Cross-reference / contrast documentation** | "The parent's ADR-001 had OBBBA exemption clauses; this ADR has IRC §1 brackets"; comparison tables that include parent terms with `❌ NOT transferred` markings | **ACCEPT with annotation** — these are evidence; cite the lesson L-003 rationale |
| **Legitimate domain vocabulary (allowlist)** | "Head of Household" filing status; "household income" in tax context | **ACCEPT with allowlist citation** |

### Step 5 — Render the verdict in the transfer-test acceptance record

The acceptance record's `anti_overfit_grep_evidence` field must include:

```json
{
  "raw_matches": <int>,
  "match_classification": [
    {"category": "intentional cross-reference comment", "count": <N>, "rationale": "..."},
    {"category": "legitimate IRS terminology", "count": <N>, "rationale": "..."},
    {"category": "wealth.com vocabulary leakage in product code", "count": <N>, "rationale": "PASS only when this is 0"}
  ],
  "verdict": "PASS only when category-3 count is 0"
}
```

The transfer-test acceptance verdict cannot be PASS while category-3 count > 0.

## Origin

- Lesson L-002 (forbidden-token false-positives on legitimate domain vocabulary) and L-003 (cross-reference comments are evidence, not slop) were captured in `runs/transfer-test-mini/02_attractor/transfer-test-acceptance-record.json §lessons_for_skill_system`.
- Hawkeye-stage0-independent (RUN-WEALTHCOM-001) had already validated that a naive grep produces explainable matches that are not slop; this protocol codifies that finding for future runs.

## Companion validators

A future `validate_anti_overfit_grep.py` validator at `df-meta-attractor/scripts/` will:

1. Load the parent run's forbidden-token list from its product-tailoring profile.
2. Load the per-archetype allowlist for the transfer-test run.
3. Walk the transfer-test tree, classify each match, and emit a JSON report.
4. Exit non-zero only when category-3 (product-code leakage) count > 0.

The validator is a planned follow-up; for v0, classification is done manually with the protocol above as the rubric.

## Trace

- Source: `runs/transfer-test-mini/02_attractor/transfer-test-acceptance-record.json` (TRANSFER-TEST-ACCEPTANCE-001) §lessons_for_skill_system L-002 + L-003
- Implements: skill-system anti-overfit discipline; meta-meta governance per `df-meta-attractor`
- Verified by: future `validate_anti_overfit_grep.py`; manual classification rubric in §4 above
