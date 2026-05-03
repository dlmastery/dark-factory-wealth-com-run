# VNV-001 · Master Test Strategy

**Status:** ACCEPTED (initial — RALPH 5-loop forthcoming with the next refinery sweep)
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Standards basis:** ISO/IEC/IEEE 29119-1/2 (test process + documentation), ISTQB CTFL test-strategy framing, IEEE 1012-2016 V&V

This artifact codifies *what we test, why, where, when, and how confidence is measured* for the EstateCompass Demo MVP. It is the umbrella under which per-slice test plans (`VNV-002`), the scenario test matrix (`VNV-003`), holdout/transfer evidence (`VNV-004`), security report (`VNV-005`), performance report (`VNV-006`, scoped down), accessibility audit (`VNV-007`), Playwright records (`VNV-008`), and visual-regression baseline (`VNV-009`) hang.

---

## 1. Strategy in one paragraph

EstateCompass tests at the level its *risk profile* demands: high safety + money + privacy + security + compliance. The test pyramid is therefore inverted from "lots of unit tests, few integration tests" to "lots of *evidence-bearing* tests at each layer the risk profile requires" — golden-dataset deterministic-calc tests for fiduciary-tax math (RSK-001/002), grounding-validator unit tests for AI hallucination containment (RSK-001), three-layer multi-tenant isolation tests for cross-tenant leak (RSK-004), and an explicit *transfer test* on a different fintech surface for factory overfit (RSK-005). Test scope is tailored per slice via the `mandatory_testing_classes` list in `PRODUCT-TAILORING-WEALTHCOM-001`. Surface flags drive *which* test classes apply: scenario_driven=true ⇒ holdout + transfer; ui_surface=true ⇒ Playwright + visual regression + a11y; api_surface=true ⇒ contract tests; production_surface=true ⇒ outage drill + release readiness (deferred at v0). Token-savings is *not* a valid reason to skip a class.

---

## 2. Risk-driven test scope (per `PRODUCT-TAILORING-WEALTHCOM-001` + `ATTR §risks`)

| Risk | Severity | Primary test classes | Secondary | Owner persona |
|---|---|---|---|---|
| RSK-001 AI hallucination on legal docs | high | grounding-validator unit; holdout-corpus eval; refusal-honesty negative tests | scenario_bdd; threat-model attack tests (T-AI-1/3) | Verification Juror + Adversarial Prosecutor |
| RSK-002 Tax calculation error | high | golden-dataset (per rule); purity tests; OBBBA-regression alert | property-based tests on monetary boundary | Tax Domain Juror + Verification Juror |
| RSK-003 UPL — outputs as legal advice | high | UI Disclaimer presence test; attorney_review_required-floor test in grounding-validator | document-creation surface deferred per CC-001 | Legal Juror |
| RSK-004 Multi-tenant data leak | high | RLS integration tests; KMS unit tests (cross-tenant decrypt failure); audit-log immutability test | OWASP IDOR scan; security-abuse class | Security Juror |
| RSK-005 Factory overfit | medium | **Transfer test** on a different fintech surface; forbidden-token grep | Adversarial generic-process critic review | System Theorist |
| RSK-006 Token spend | medium | engagement-governance budget checkpoints; spend-pace alerts | n/a (process control) | Engagement Partner |
| RSK-007 Brand IP | medium | brand-substitution CI gate; forbidden-marks grep | UI design review | Legal |
| RSK-008 Multi-day context loss | medium | resume-from-TASKS.md replay test (manual at v0) | df-context-memory pack validators | Operational |
| RSK-009 PHI in HCDs | medium | n/a (HCDs deferred per CC-001); architecture supports posture | per-tenant KMS isolation tests | Privacy Juror |
| RSK-010 PRD claims unverified | low | atom provenance protocol (L-001); validate_prd_atoms.py | adversarial review of intake | Evidence Clerk |

---

## 3. Test classes — definitions, gates, and current evidence on `main`

| Class | Required for | Tool | Current count on main | Pending |
|---|---|---|---|---|
| Unit (no DB/network) | code_producing | vitest (TS) + pytest (Py) | ~91 (38 calc, 8 grounding, 10 auth+config, 4 doc-service, 4 calc-client, 7 kms, 20 atom-validator) | a11y unit; visual snapshot |
| Integration (DB-required) | api_surface + data_surface | vitest with `pg` | 9 (5 RLS isolation + 4 household aggregate) | full e2e auth+upload+extract roundtrip |
| Contract / API | api_surface | Zod schema validators | 4 (calc-engine client) | OpenAPI consumer contracts |
| Scenario / BDD | scenario_driven | pytest | 4 (Doe Family demo + low-growth warning + principal-too-large + OBBBA regression alert) | Playwright e2e walk |
| Holdout / Transfer | scenario_driven | custom eval + transfer-test workload | **15 (transfer test PASS)** | Sage extractor holdout pending Slice-4 Claude integration + OQ-INTAKE-005 |
| Security / abuse | regulated_or_high_assurance | manual + DB integration + threat model | 12 (3 tenant-bypass, 1 audit immutability, 1 cross-tenant KMS, 2 tamper detection, 1 crypto-shred, 4 grounding rejection) | ZAP scan; prompt-injection battery; IDOR bulk |
| Performance / reliability | scaled-by-surface | scoped to single-user v0 | 0 (waived single-user v0) | full load (deferred) |
| Accessibility / UX | ui_surface | Playwright + axe-core | 0 | WCAG 2.1 AA |
| Browser / WYSIWYG | ui_surface | Playwright | 0 | e2e specs walking the demo path |
| Visual regression | ui_surface | Playwright snapshot or Percy | 0 | baseline + diff |
| Production drill | production_surface | runbook replay + outage drill | 0 (deferred, WAIVER-001) | n/a until production_surface flips |

**Headline:** ~110+ runnable tests, ~75 runnable-without-DB. Disproportionately concentrated at the layers the risk profile demands.

---

## 4. Test data discipline

- **Synthetic only at v0** per HD-008. The Doe Family seed (`0005_seed_demo.sql`) is the canonical fixture.
- **Holdout dataset** for Sage MUST come from public corpora (open law-school sample wills, public probate filings) — *not* PRD examples (per ADR-003 + open question OQ-INTAKE-005).
- **Negative test data** lives alongside positive in golden datasets (`obbba_baseline.json::negative_cases`, `grat_cases.json::negative_cases`, `federal_income_tax_2026.json::negative_cases`).
- **Adversarial data** for prompt-injection battery: sourced from OWASP LLM Top-10 + Anthropic published red-team patterns. Pending Slice-4 Claude integration.

---

## 5. RALPH discipline as a meta-test

Per `df-quality-refinery`, every governed artifact must complete ≥5 RALPH loops before pass:

- **R**eview — score artifact-level (18 checks) + each critic seat (15 checks)
- **A**ttack — adversarial critics (≥2 per artifact) try to break the artifact
- **L**earn — root-cause analysis on failures
- **P**atch — update artifact + evidence + traces
- **H**arden — re-run validators; record residual risk

Current state: most artifacts on main have shipped without explicit RALPH loop records. The forthcoming refinery sweep will produce one RALPH log per: ATTR-WEALTHCOM-001, GOV-001, ADR-001/002/003, ARC-005, HLD-001, DDD-001, per-slice (1, 2, 3, 4, 5, 6, 9), VNV-001 (this artifact).

The transfer test itself constitutes a RALPH-equivalent at the *factory pattern* level: review (acceptance record), attack (forbidden-token grep + adversarial generic-process review), learn (L-002, L-003), patch (queued for df-feedback-learning), harden (final Hawkeye now in flight).

---

## 6. Promotion criteria — what "tested" means at each stage

| Stage | Tests required to pass |
|---|---|
| Unit-level commit | green local unit tests for the changed module |
| Slice acceptance | per-slice plan (`VNV-002-{slice}`) all green + RALPH 5-loop record |
| Stage exit | all `mandatory_testing_classes` for that stage's surface flags green |
| Run closure | every accepted slice has its RALPH log; transfer test pass; final Hawkeye conformance audit pass |

---

## 7. Anti-slop discipline applied to tests themselves

The same zero-slop policy that governs governance artifacts applies to tests:

- A test claiming to verify a property MUST exercise that property in its assertions. (E.g., `test_grat_scenario_uses_obbba_exemption` would catch a calc-engine reverting to TCJA's $7M because it asserts `federal_estate_tax == 0` on an $8M estate — silent reversion fails this exact test.)
- Test names MUST describe the property under test, not the implementation detail.
- Golden datasets MUST include rationale per case.
- "I tested it manually" is not a test class.

---

## 8. Trace links

- Source: ATTR-WEALTHCOM-001 §risks RSK-001..010; PRODUCT-TAILORING-WEALTHCOM-001 §mandatory_testing_classes + §risk_profile
- Implements: GOV-001 §13 quality gates; df-quality-refinery RALPH discipline
- Refines into: VNV-002 per-slice plans; VNV-003 scenario matrix; VNV-004 holdout/transfer evidence (transfer test already accepted via TRANSFER-TEST-ACCEPTANCE-001); VNV-005 security report; VNV-007 a11y; VNV-008 Playwright records; VNV-009 visual baseline
- Verified by: green test counts in §3 (cross-checkable against the file tree on main); the Hawkeye conformance audit's `testing_rigor` axis vote
