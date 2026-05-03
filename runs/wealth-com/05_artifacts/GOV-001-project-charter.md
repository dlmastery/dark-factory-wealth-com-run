# GOV-001 · Project Charter — EstateCompass Demo MVP

**Status:** ACCEPTED (post-checkpoint-#1; CC-001 scope-amended)
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Standards basis:** ISO/IEC/IEEE 12207:2017, IEEE 29148:2018 (charter contents), CMMI V3.0 (Project Planning)

## 1. Project name & code

- **Working title:** EstateCompass (per HD-002; not "wealth.com" — registered marks not used)
- **Internal AI name:** Sage (substitute for Ester®)
- **Run identifier:** RUN-WEALTHCOM-001 (the dark-factory run; the *workload* is the wealth.com clone)

## 2. Vision

A regulated AI-fintech reference workload that demonstrates the dark-factory governance system on a high-stakes, multi-tenant, document-intelligence SaaS — and produces a walkable demo proving the architecture pattern (extract → deterministic-compute → narrate, with citation grounding and tenant isolation).

## 3. Mission for Demo MVP

Deliver a locally-runnable Docker Compose demo where an advisor can:

1. Log into a multi-tenant advisor workbench
2. View their household list (only their tenant's data; tenant isolation provable)
3. Open a household, upload a sample trust document
4. Watch the Sage extractor produce structured facts with per-field provenance + confidence tiers
5. View the federal estate tax baseline calculation under OBBBA $15M permanent
6. Compare ONE scenario: GRAT vs do-nothing for a $20M household

…with full evidence: RALPH 5-loop record per artifact, golden-dataset tests for the calc engine, holdout dataset for the extractor, Playwright traces of the UI, OWASP scan zero P0/P1, and a transfer-test on a different fintech surface proving the factory generalizes.

## 4. Success criteria (definition of done)

The Demo MVP is **DONE** when ALL of:

| ID | Criterion | Evidence |
|---|---|---|
| DOD-1 | Walkable demo from `docker compose up` to scenario comparison view | Playwright recording + manual demo script + screenshots |
| DOD-2 | Multi-tenant isolation provable | OWASP/abuse test report shows zero cross-tenant leakage in attack scenarios |
| DOD-3 | Federal estate tax calc under OBBBA matches golden dataset | `apps/calc-engine/tests/golden/` ≥ 20 cases, 100% pass |
| DOD-4 | Sage extractor passes holdout eval | F1 ≥ 0.85 on sourced public corpus; refusal honesty ≥ 95% |
| DOD-5 | GRAT scenario comparison renders correct numbers | scenario test matrix records pass |
| DOD-6 | All in-scope artifacts have RALPH 5-loop records and quality certificates | refinery gate records green; certificates present |
| DOD-7 | Transfer test passes on second workload | factory generalization proven |
| DOD-8 | Final Hawkeye conformance audit issues run-closure certificate | hawkeye-final.json, verdict pass or conditional_pass |
| DOD-9 | Retrospective + skill-system update PRs drafted | lesson records + PRs |
| DOD-10 | Client_owner acknowledges deliverable | sign-off in TASKS.md |

## 5. Scope

### In scope (per CC-001)

| ID | Capability | Slice |
|---|---|---|
| CAP-AUTH-MULTITENANT | Auth + Tenant + Identity (Postgres RLS isolation, RBAC, MFA-stub, SSO-stub) | Slice 1 |
| CAP-HOUSEHOLD-MODEL | Household → Person → Entity (Trust types: Revocable, GRAT, Dynasty placeholders) → Asset | Slice 2 |
| CAP-DOCUMENT-VAULT | Encrypted upload + per-tenant KMS DEK + WORM audit log | Slice 3 |
| CAP-EXTRACTION | Sage extractor: layout-aware OCR mock + LLM extraction + grounding validator + citation provenance | Slice 4 |
| CAP-ESTATE-TAX-CALC | Federal estate tax baseline under OBBBA $15M permanent (deterministic engine, golden dataset) | Slice 5 |
| CAP-SCENARIO-MODELING | GRAT vs do-nothing comparison for $20M household | Slice 6 (narrowed to 1 scenario) |
| CAP-INTEGRATION-MOCKS | 2 contract+mock adapters (Plaid-shape balance ingest, Schwab-shape position ingest) | Slice 8 (narrowed to 2) |
| CAP-ADVISOR-UI | Minimal walkable advisor UI: login → dashboard → household → upload → extraction review → tax view → scenario view | Slice 9 |

### Out of scope for Demo MVP (deferred per CC-001)

- Family Office Suite (governance UI for multi-entity HNW)
- Heritage Map (multi-generational visualization)
- Ownership Balance Sheet
- Estate Tax Projections beyond 1 scenario
- Full Tax Planning surface (1040, W-2, look-back/forward, prior-year safe harbor)
- Document Creation surface (POA, Revocable Trust, AHCD, Guardian drafting — UPL complexity)
- Full Scenario Builder strategy library (SLAT/ILIT/CLAT/Dynasty/QPRT/IDGT/CRT/CRUT)
- Reports surface (Executive Summary, Standalone Visual Report, Form 706/709)
- Integrations Hub beyond the 2 mocks
- Mobile app
- Tasks surface
- Client Portal (advisor-only UI in MVP)
- Voice-to-text intake

### Explicit non-goals

- This is **not** a production deployment. `production_surface=false` per HD-004.
- This is **not** a SOC 2-audited system. Posture is designed; audit is out of scope.
- This is **not** built on real PII/PHI. Synthetic data only per HD-008.
- This is **not** a faithful reproduction of wealth.com's actual stack. Architecture is the dark-factory's product-tailored answer for this workload class.

## 6. Stakeholders

| Role | Responsibility | Person |
|---|---|---|
| Client owner / Approval authority | Scope approval, checkpoint sign-off, threshold-reduction approval, production-surface decisions | eranti@gmail.com |
| Delivery owner / Orchestrator | Run governance, dispatch subagents, author artifacts, drive stages | claude-orchestrator (Claude Opus 4.7) |
| AI personas (jurors, reviewers) | Review per artifact, run RALPH loops | Per `ai-judge-jury-policy.json` |
| Hawkeye Conformance Auditor | Independent verify-and-veto at stage exits | Independent subagent dispatch (no chat-context handoff) |

Per RASCI in `engagement-governance-record.json`:
- Product intent: A=client_owner; R=intake-spec-lab persona
- Architecture: A=client_owner; R=architect persona
- Code change: A=delivery owner; R=construction beads
- Artifact acceptance: A=governance-mayor persona; R=artifact author
- Production release: deferred (production_surface=false at v0)

## 7. Constraints (non-negotiable)

Per ATTR-WEALTHCOM-001 §non_negotiable_constraints_locked_in + this charter:

1. Deterministic-calc layer architecturally separated from LLM (ADR-001)
2. Multi-tenant isolation at three layers: Postgres RLS + connection-pool wrapper + per-tenant KMS (ADR-002)
3. AI extraction with citation grounding + confidence tiers + refusal honesty (ADR-003)
4. Brand substitution: no use of registered wealth.com marks (HD-002)
5. Synthetic data only (HD-008); no real PII/PHI
6. UPL handling: extracted facts only; no execution-ready legal document generation (HD-007)
7. Holdout dataset for Sage extractor must come from public corpora, not PRD examples
8. RALPH 5-loop minimum on every governed artifact
9. ≥2 adversarial critics on every artifact panel
10. Hawkeye conformance audit at every stage exit + run closure (independent persona)
11. ≥96% per-expert review threshold (no reductions without owner-scoped waiver)
12. 100% mandatory traceability (or explicit deferral)
13. 0 unresolved P0/P1 security findings at run closure
14. Transfer test on a different fintech surface before run closure (anti-overfit per RSK-005)

## 8. Assumptions (current; revalidation triggers in ATTR §assumptions)

- ASM-001: Multi-session run with `df-context-memory` for resume safety (validated by checkpoint-1 approval)
- ASM-002: PRD is canonical source; Grok-authored speculative content filtered during atom extraction
- ASM-003 [INVALIDATED 2026-04-26]: TCJA sunset assumption — superseded by FACT-OBBBA-001
- FACT-OBBBA-001: Federal exemption permanently $15M (2026); top rate 40%
- FACT-NYDFS-PART500-2025: NY tenant compliance baseline includes Part 500 (Nov 2025)
- FACT-ADMT-CCPA-2027: AI recommendation transparency rules effective 2027 — informs Sage UX
- ASM-005: AI personas accepted as elite-role contracts (per skill-system allowance)

## 9. Risks (top 10; full register in ATTR §risks)

| ID | Title | Severity | Owner | Mitigation |
|---|---|---|---|---|
| RSK-001 | AI extraction hallucination on legal documents | high | AI engineer | ADR-001 + ADR-003 (separation + grounding + holdout) |
| RSK-002 | Tax calculation error → IRS exposure | high | Tax domain juror | Deterministic engine + golden dataset; OBBBA accuracy locked |
| RSK-003 | UPL — generated outputs mistaken for legal advice | high | Legal juror | HD-007: educational framing; attorney review required; no execution-ready legal docs in MVP |
| RSK-004 | Multi-tenant data leak | high | Security juror | ADR-002 (RLS + connection-pool + KMS) |
| RSK-005 | Factory overfit to wealth.com | medium | System theorist | Anti-overfit rules + transfer test bead |
| RSK-006 | Token spend overrun | medium | Engagement partner | CC-001 re-budget + 75%-of-mid checkpoint |
| RSK-007 | Brand IP infringement | medium | Legal | Brand substitution (HD-002) |
| RSK-008 | Multi-day context loss | medium | Operational | df-context-memory packs + TASKS.md as resume surface |
| RSK-009 | PHI in HCDs — HIPAA implications | medium | Privacy juror | Synthetic only; encryption posture supports BAA |
| RSK-010 | PRD claims unverified become requirements | low | Evidence clerk | PRD-atom citation grounding (L-001 enforced) |

## 10. Methodology blend (per `df-methodology-blender`)

- **RUP**: phased gate discipline (Inception → Elaboration → Construction → Transition).
- **MDA**: CIM (advisor business workflow) / PIM (tenant-agnostic domain model) / PSM (Node+TS+Postgres+Python deployment).
- **DDD**: Bounded contexts with ubiquitous language (DDD-001 glossary, DDD-002 context map).
- **TDD/BDD**: red-green-refactor per slice; scenario_bdd for advisor flows.
- **SRE**: SLO-aware patterns even at v0 (observability, error budgets); production-handoff stages deferred.
- **SSDF / OWASP SAMM**: secure-development practices; threat model (ARC-005) at architecture stage.
- **ISO 42001**: AI Management System discipline (model cards, eval harness, human-in-loop).

## 11. Token budget (per CC-001)

- Low: 250K
- Mid: 600K (target band)
- High: 1.0M
- Stage-0 consumed: ~90K (~36% of low band)
- Reapproval at: +15% delta from new mid OR scope change OR threshold reduction OR real-partner integration
- 75%-of-original-mid checkpoint at 300K cumulative spend

## 12. Schedule

Multi-day, paced by stage gates and client checkpoints. Per `factory-pert-plan.json` critical path:

```
Stage-0 attractor    ✅ DONE 2026-04-26
Stage-0 recon        ✅ DONE
Stage-0 Hawkeye      ✅ DONE (CONDITIONAL_PASS + patches applied)
CHECKPOINT-#1        ✅ APPROVED 2026-04-26
Stage-1 intake       🟡 IN FLIGHT
Stage-2 feasibility  ⏸ blocked
Stage-3 inception    🟡 partial — this charter + 3 ADRs authored ahead
Stage-4 architecture ⏸ HLD+LLD+DDD+threat model pending intake outputs
Stage-5 planning     ⏸ blocked
Stage-6 construction ⏸ Slices 1-9
Stage-7 V&V          ⏸ blocked
Transfer test        ⏸ blocked
Retrospective        ⏸ blocked
Final Hawkeye        ⏸ blocked
RUN CLOSED           ⏸
```

## 13. Quality gates

- Each governed artifact: RALPH 5-loop minimum, 18 artifact-level checks, 15-per-critic-seat checks, ≥2 adversarial critics, certificate.
- Each stage exit: Hawkeye Conformance Audit (independent persona) — pass required.
- Each material transition: AI Judge/Jury verdict (TPM Judge + Evidence Clerk + 3 specialist jurors + Adversarial Prosecutor + Foreperson).
- Defaults: 98% governance, 96%/expert, 100% trace, 0 P0/P1 security.

## 14. Approval

- **Charter approved by:** client_owner = eranti@gmail.com
- **Approval mechanism:** "approve all defaults" at checkpoint-#1 (2026-04-26) + "A" (2026-05-03) accepting CC-001 scope amendment
- **Charter binding for:** RUN-WEALTHCOM-001
- **Revalidation triggers:** any scope amendment beyond CC-001; any threshold reduction; any surface-flag change; any real-partner integration request; +15% token forecast delta

## Trace links

- ATTR-WEALTHCOM-001 (foundational)
- ENG-GOV-WEALTHCOM-001 (engagement)
- CC-001 (Demo MVP scope)
- PRODUCT-TAILORING-WEALTHCOM-001 (archetype + risk + methodology)
- GENERATED-META-SKILL-WEALTHCOM-001 (refusal rules)
- SDLC-COVERAGE-WEALTHCOM-001 (stages)
- KG-WEALTHCOM-001 (knowledge graph nodes)
- TPM-FLOW-WEALTHCOM-001 + PERT-WEALTHCOM-001 (sequence + dependencies)
- ADR-001 / ADR-002 / ADR-003 (architectural constraints already accepted)
- domain-brief.md (citations)
- critical-findings-summary.md (FACT-OBBBA-001 etc.)
