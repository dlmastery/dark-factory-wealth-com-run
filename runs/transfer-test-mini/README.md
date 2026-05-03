# Transfer-Test Mini · `RUN-TRANSFER-001`

**Purpose:** Anti-overfit proof. Apply the same dark-factory skill system to a workload that is **deliberately different** from wealth.com. If the factory overfits, this run will require wealth.com-specific assumptions (Household, Trust, GRAT, advisor/client hierarchy) — which are forbidden as universal patterns. If it doesn't, the factory generalizes.

This run satisfies bead `TB-WC-2026-0508-021` from the wealth.com run's PERT plan and addresses risk `RSK-005` (factory overfit) from `ATTR-WEALTHCOM-001`.

## The deliberately-different workload

**TaxBaseline Mini** — a single-user desktop tool for solo CPAs that:
1. Ingests a 1040 + W-2 PDF (mock at v0).
2. Computes a federal income tax baseline for the current year.
3. Outputs a one-page summary with deterministic citations.

**Why this workload is a real anti-overfit test:**

| Dimension | wealth.com clone | TaxBaseline Mini | Differs? |
|---|---|---|---|
| User | Multi-tenant (advisor firms) | Single user (sole-prop CPA) | ✓ |
| Domain entity hierarchy | Household → Person → Entity → Asset | Just `TaxFiling` | ✓ |
| Tax law focus | Estate / gift / GST under OBBBA | Income tax under IRC §1 | ✓ |
| Document type | Wills, trusts, POAs, AHCDs | 1040, W-2, 1099 | ✓ |
| Deployment | Browser SaaS | Desktop CLI / single-user | ✓ |
| Multi-tenant isolation | RLS + KMS + connection-pool | Not applicable (single user) | ✓ |
| AI extraction | Sage on legal documents | Sage on tax forms | partially shared |
| Deterministic calc | Estate tax rules | Income tax brackets | shared *pattern* |
| Audit log | WORM with FINRA 17a-4 | Local immutable log | shared *pattern* |
| ADR-001 (no LLM math) | applies | applies | shared |
| ADR-002 (multi-tenant) | applies | n/a (different archetype) | distinguished |
| ADR-003 (citation grounding) | applies | applies | shared |
| RALPH 5-loop, ≥2 adversarial critics | applies | applies | shared |
| Hawkeye independent audit | applies | applies | shared |

**The factory passes if:** ADR-001, ADR-003, RALPH, Hawkeye, and the meta-attractor's product-tailoring profile transfer cleanly. ADR-002 should NOT transfer (different archetype). No wealth.com nouns (Ester, Heritage Map, Household, Trust, GRAT) appear in the TaxBaseline Mini's code or tailoring profile.

**The factory fails if:** any factory-reusable template forces wealth.com vocabulary; any rubric scores TaxBaseline Mini against irrelevant wealth.com criteria; the generated meta-skill contract requires Household/Trust modeling.

## Layout

```
runs/transfer-test-mini/
├── README.md                                        ← this file
├── 02_attractor/
│   ├── meta-attractor-record.json                   ← ATTR-TRANSFER-001
│   ├── product-tailoring-profile.json               ← different surface flags vs wealth.com
│   └── generated-meta-skill-contract.json           ← TaxBaseline-specific refusal rules
├── 05_artifacts/
│   ├── ADR-T-001-deterministic-calc-separation.md   ← inherited pattern (ADR-001 transferred)
│   └── ADR-T-002-no-multi-tenant-by-design.md       ← documents the deliberate divergence
└── app/apps/tax-mini/
    ├── pyproject.toml
    ├── tax_mini/
    │   └── rules/
    │       └── federal_income_tax_2026.py           ← deterministic; pattern shared with wealth.com calc-engine
    └── tests/
        ├── golden/
        │   └── federal_income_tax_2026.json         ← golden dataset (pattern shared)
        └── test_federal_income_tax.py               ← pytest parametrized (pattern shared)
```

## Acceptance

The transfer test passes when:

1. ✅ Meta-attractor + tailoring + generated meta-skill produce a coherent factory run for TaxBaseline Mini that does NOT require wealth.com vocabulary.
2. ✅ ADR-001 transfers as ADR-T-001 — same deterministic-calc separation pattern, different rule library.
3. ✅ ADR-002 is explicitly NOT transferred (ADR-T-002 documents why); demonstrates the factory tailors per archetype rather than blanket-applying.
4. ✅ A working calc rule (federal income tax 2026 brackets) ships with golden dataset + ≥10 cases passing.
5. ✅ Adversarial generic-process-critic review confirms no wealth.com nouns leaked.
6. ✅ Final Hawkeye for the wealth.com run cites this transfer-test run as evidence of anti-overfit conformance axis pass.

## Out of scope for the transfer test

- Full UI (this is a CLI/library demonstration of the pattern, not a product)
- Real partner integrations
- Multi-tenant anything
- Estate/gift/GST tax (different archetype)

The point is the factory **pattern**, not a second product.
