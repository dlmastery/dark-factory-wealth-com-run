**NO AI SLOP ALLOWED AT ALL - ZERO TOLERANCE TO SLOP AND HALLUCINATIONS**

# TASKS — Wealth.com Dark-Factory Run (RUN-WEALTHCOM-001)

## Project Task Bead Operating Rules

- Every material task must have a bead before work starts.
- Every bead names: source, owner, state, control graph node, work-ledger item, knowledge-graph node, gate, evidence, next bead or closure rationale.
- A bead cannot move to `accepted` without trace links, evidence, gate result, and next bead or closure rationale.
- A bead cannot move to `rework` without review findings and a patch bead.
- A bead cannot move to `blocked` without unblock owner, action, recheck date.
- Token-budget, scope, AC, or schedule drift creates a change-control bead.
- Templates are not proof. Instantiated evidence linked separately.

## Current Run

| Field | Value |
| --- | --- |
| Run ID | `RUN-WEALTHCOM-001` |
| Attractor Run Record | `ATTR-WEALTHCOM-001` (`runs/wealth-com/02_attractor/meta-attractor-record.json`) — attractor_state=stable as of 2026-04-26 |
| Control Graph | `CG-WEALTHCOM-001` (forthcoming at stage-architecture) |
| Knowledge Graph | `KG-WEALTHCOM-001` (`runs/wealth-com/09_traceability/knowledge-graph-seed.json`) |
| Work Ledger | `WL-WEALTHCOM-001` (rolling — see ledger) |
| Engagement Governance | `ENG-GOV-WEALTHCOM-001` — **APPROVED 2026-04-26** at checkpoint-#1 |
| Token Budget State | `approved low150K-mid400K-high1.2M` |
| Current Client Checkpoint | `checkpoint-1 CLOSED 2026-04-26 (next: CHK-2 at Stage-4 architecture release)` |
| Product Tailoring Profile | `PRODUCT-TAILORING-WEALTHCOM-001` |
| Generated Meta-Skill Contract | `GENERATED-META-SKILL-WEALTHCOM-001` |
| SDLC Stage Coverage Matrix | `SDLC-COVERAGE-WEALTHCOM-001` |
| Hawkeye Latest | `HAWKEYE-WEALTHCOM-001-stage0` (forthcoming this commit) |

## Active Beads

| Bead ID | State | Objective | Owner | Control Node | KG Node | Gate | Evidence | Next Bead | Token SWAG | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-WC-2026-0426-005` | `active` | Stage-1 intake interrogation kickoff | df-intake-spec-lab persona (subagent dispatch in progress) | CG-NODE-S1-INTAKE | KG:STEP-S1 | intake quality gate | interrogation-record + spec-decomposition-record | TB-WC-2026-0426-006 | low~25K mid~50K high~90K | unblocked-by-checkpoint-1 |

## Ready And Queued Beads

| Bead ID | State | Objective | Owner | Control Node | Inputs | Outputs | Gate | Evidence | Next Bead | Token SWAG | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-WC-2026-0425-002` | `queued` | PRD re-extraction with strict line-cited atoms (corrective for INC-001) | subagent a9c770a239d1a2f15 (general-purpose) | CG-NODE-S0-RECON | wealth_com_PRD_transcript.md + artifacts + youtube | prd-atoms.json + prd-canonical.md + prd-extraction-report.json | grep-self-verification ≥10/10 sample pass | extraction-report self-grep | TB-WC-2026-0425-003 | low~30K mid~60K high~90K | pending |
| `TB-WC-2026-0425-003` | `queued` | Hawkeye-Stage0 conformance audit (independent persona) | hawkeye-auditor-subagent (forthcoming dispatch) | CG-NODE-S0-HAWKEYE | All Stage-0 records | hawkeye-stage0-audit.json | conformance axes pass | audit findings | TB-WC-2026-0425-004 (checkpoint-1 prep) | low~5K mid~10K high~18K | pending |
| `TB-WC-2026-0425-004` | `queued` | Prepare and present checkpoint-#1 prompt to client | claude-orchestrator | CG-NODE-S0-CHECKPOINT | Stage-0 pack + Hawkeye audit | checkpoint-1 prompt with HD-001..HD-009 | client decision | client message | TB-WC-2026-0426-005 (intake stage) | low~3K | pending |
| `TB-WC-2026-0426-005` | `blocked-on-checkpoint-1` | Stage-1 intake interrogation kickoff | df-intake-spec-lab persona | CG-NODE-S1-INTAKE | client-approved ENG-GOV + PRD atoms | interrogation-record.json | intake quality gate | answer IDs + decomposition seeds | TB-WC-2026-0426-006 | low~25K mid~50K high~90K | blocked-pending TB-004 |
| `TB-WC-2026-0426-006` | `blocked` | Stage-1 recursive spec decomposition | df-intake-spec-lab persona | CG-NODE-S1-DECOMP | interrogation-record | spec-decomposition-record.json + validate_spec_decomposition.py pass | decomposition quality gate | leaf-level evidence | TB-WC-2026-0427-007 | low~40K mid~80K high~150K | blocked-pending TB-005 |
| `TB-WC-2026-0427-007` | `blocked` | Stage-2 feasibility/risk options panel | swarm panel | CG-NODE-S2-FEASIBILITY | spec-decomposition | feasibility-options + risk-register-v1 | 3-expert panel review | panel record | TB-WC-2026-0428-008 | low~12K mid~25K high~45K | blocked |
| `TB-WC-2026-0428-008` | `blocked` | Stage-3 inception charter (GOV-001/002/005) | df-artifact-factory | CG-NODE-S3-INCEPTION | feasibility-options | GOV-001 Charter + GOV-002 RACI + GOV-005 Standards Tailoring | RALPH 5-loop pass + critic panel | RALPH log + cert | TB-WC-2026-0429-009 | low~30K mid~60K high~110K | blocked |
| `TB-WC-2026-0429-009` | `blocked` | Stage-4 architecture/design pack (HLD/LLDs/ADRs/MDA/DDD/Threat Model) | df-artifact-factory + methodology-blender | CG-NODE-S4-ARCH | Charter + RACI | ARC-001..005 + MDA-001 + DDD-001/002 | RALPH 5-loop pass per artifact | RALPH logs + certs | TB-WC-2026-0430-010 | low~80K mid~160K high~280K | blocked |
| `TB-WC-2026-0430-010` | `blocked` | Stage-5 planning PERT detail + sprint plan | TPM Judge | CG-NODE-S5-PLAN | architecture pack | detailed PERT-WEALTHCOM-001 v2 + sprint cards | critical path validated | PERT validator | TB-WC-2026-0501-011 | low~10K mid~20K high~35K | blocked |
| `TB-WC-2026-0501-011` | `blocked` | Stage-6 construction — Slice 1 (Auth + Tenant + Identity) | construction beads | CG-NODE-S6-SLICE-1 | architecture | code + tests | TDD evidence + RALPH | per-slice cert | TB-WC-2026-0502-012 | low~40K mid~80K high~150K | blocked |
| `TB-WC-2026-0501-012` | `blocked` | Construction Slice 2 (Household + People + Entities) | construction | CG-NODE-S6-SLICE-2 | Slice 1 | code + tests | TDD + RALPH | cert | TB-WC-2026-0502-013 | low~40K mid~80K high~150K | blocked |
| `TB-WC-2026-0501-013` | `blocked` | Construction Slice 3 (Document upload + storage + WORM audit) | construction | CG-NODE-S6-SLICE-3 | Slice 1, 2 | code + tests | TDD + RALPH + tenant isolation | cert | TB-WC-2026-0502-014 | low~50K mid~100K high~180K | blocked |
| `TB-WC-2026-0501-014` | `blocked` | Construction Slice 4 (Ester extractor — LLM + deterministic-calc layer + holdout) | construction + AI eng | CG-NODE-S6-SLICE-4 | Slice 3 | code + tests + holdout dataset | extraction F1 ≥ threshold + transfer-test | RALPH + holdout report | cert | TB-WC-2026-0503-015 | low~80K mid~150K high~280K | blocked |
| `TB-WC-2026-0501-015` | `blocked` | Construction Slice 5 (Estate model + tax baseline calc) | construction | CG-NODE-S6-SLICE-5 | Slice 2, 4 | code + tests + golden dataset | calc engine determinism + IRS-form mapping | golden test report | TB-WC-2026-0503-016 | low~70K mid~140K high~250K | blocked |
| `TB-WC-2026-0501-016` | `blocked` | Construction Slice 6 (Scenario Builder — GRAT/SLAT/ILIT/CLAT/Dynasty) | construction | CG-NODE-S6-SLICE-6 | Slice 5 | code + tests + scenario matrix | scenario_bdd 100% in-scope | scenario test report | TB-WC-2026-0504-017 | low~70K mid~140K high~260K | blocked |
| `TB-WC-2026-0501-017` | `blocked` | Construction Slice 7 (Reports — Executive Summary + Standalone Visual + 706/709 worksheets) | construction | CG-NODE-S6-SLICE-7 | Slices 4, 5, 6 | code + tests | report rendering + content fidelity | per-report cert | TB-WC-2026-0505-018 | low~50K mid~100K high~180K | blocked |
| `TB-WC-2026-0501-018` | `blocked` | Construction Slice 8 (Integrations Hub — 2 real-shape mocks + 17 contract mocks) | construction | CG-NODE-S6-SLICE-8 | Slice 1, 2, 3 | code + adapter contract tests | contract_api per partner | adapter test report | TB-WC-2026-0506-019 | low~60K mid~120K high~220K | blocked |
| `TB-WC-2026-0501-019` | `blocked` | Construction Slice 9 (Advisor Workbench UI + Client Portal UI) | construction | CG-NODE-S6-SLICE-9 | Slices 1-8 | UI code + Playwright | a11y + WCAG 2.1 AA + visual regression | Playwright records + visual baseline | TB-WC-2026-0507-020 | low~80K mid~160K high~300K | blocked |
| `TB-WC-2026-0507-020` | `blocked` | Stage-7 verification & validation (cross-cutting) | df-quality-refinery | CG-NODE-S7-VNV | all slices | VNV-001..009 reports | per-class threshold | reports | TB-WC-2026-0508-021 | low~40K mid~80K high~150K | blocked |
| `TB-WC-2026-0508-021` | `blocked` | Transfer-test bead (anti-overfit) — apply factory to mini Holistiplan-style tax-baseline workload | factory + new-product-tailoring | CG-NODE-TRANSFER | factory v1 | transfer-test artifact + cert | factory generalization passes | transfer-test report | TB-WC-2026-0509-022 | low~30K mid~60K high~110K | blocked |
| `TB-WC-2026-0509-022` | `blocked` | Stage-final retrospective + lesson record + skill-system update PRs | df-feedback-learning | CG-NODE-S-RETRO | all prior + transfer-test | lesson-record + skill-system PRs | feedback gate | retro evidence | RUN-CLOSED | low~10K mid~20K high~35K | blocked |

**Note:** Slices 1-9 are sequenced with dependency edges; in execution they may parallelize where dependencies allow (per PERT-WEALTHCOM-001 ready candidates).

## Blocked Beads

| Bead ID | Blocker | Unblock Owner | Unblock Action | Recheck Date |
| --- | --- | --- | --- | --- |
| `TB-WC-2026-0426-005` and downstream | Checkpoint-#1 not yet held | client_owner = eranti@gmail.com | Approve HD-001..HD-009 (or amend) | as soon as checkpoint-1 prompt presented |

## Review And Rework Beads

(none yet)

## Accepted Beads

| Bead ID | State | Objective | Outputs | Gate | Evidence | Next Bead | Closure Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-WC-2026-0425-001` | `accepted` | Stage-0 attractor pack drafting | 18 governance records under runs/wealth-com/ | GATES A-E pass + Hawkeye-Stage0-independent CONDITIONAL_PASS + checkpoint-#1 approval | runs/wealth-com/02_attractor/* + runs/wealth-com/12_hawkeye/hawkeye-stage0-independent.json + checkpoint-1-approval-record.json | TB-WC-2026-0425-002 | Stage-0 fully exited; F-001/F-009 patched; F-002 closed by domain brief |
| `TB-WC-2026-0425-002` | `accepted` | PRD re-extraction with strict provenance | prd-atoms.json (212 atoms) + prd-canonical.md + prd-extraction-report.json | self-grep ≥10/10 (got 20/20) | runs/wealth-com/00_recon/prd-extraction-report.json §self_grep_verification | TB-WC-2026-0425-003 | Corrective bead for INC-001; mitigation successful |
| `TB-WC-2026-0425-002B` | `accepted` | Domain research re-dispatch (per-section) | domain-brief.md (827 lines, 165 citations) + critical-findings-summary.md | ≥30 citations + GAPS section per topic (got 165 citations, all 10 sections with GAPS) | runs/wealth-com/01_domain/* | TB-WC-2026-0426-PATCH-001 | Surfaced FACT-OBBBA-001 + 5 other material findings |
| `TB-WC-2026-0425-003` | `accepted` | Hawkeye-Stage0 conformance audit (independent persona) | hawkeye-stage0-independent.json | 12/12 axes pass + 7/7 adversarial tests pass + verdict CONDITIONAL_PASS | runs/wealth-com/12_hawkeye/hawkeye-stage0-independent.json | TB-WC-2026-0426-PATCH-001 | F-001 P2, F-009 P3 → patched; F-002 P1 closed by domain brief; F-006/F-011 deferred-with-rationale or closed |
| `TB-WC-2026-0426-PATCH-001` | `accepted` | Apply Hawkeye-Stage0 patches | TB-WC-2026-0508-021 ID fix + INC-001 phrasing precision fix + F-002 closure | all P1+P2+P3 from Hawkeye addressed | runs/wealth-com/12_hawkeye/hawkeye-stage0-patch-bead.json | TB-WC-2026-0425-004 | Audit loop closed |
| `TB-WC-2026-0425-004` | `accepted` | Checkpoint-#1 client approval | checkpoint-1-approval-record.json + ENG-GOV transitioned to approved + meta-attractor ASM-003 invalidated/superseded by FACT-OBBBA-001 | boundary-human approval (skill-system rule) | runs/wealth-com/02_attractor/checkpoint-1-approval-record.json + runs/wealth-com/03_governance/engagement-governance-record.json (status=approved) | TB-WC-2026-0426-005 | "approve all defaults" received 2026-04-26 |

## Deferred And Retired Beads

| Bead ID | Rationale | Superseded By | Expiry |
| --- | --- | --- | --- |
| Production stages | production_surface=false at v0 | conditional re-entry | when HD-004 amended |

## Bead Detail Records

### `TB-WC-2026-0425-001` (active)
- Objective: Author the full Stage-0 attractor pack + governance draft + initial Hawkeye + checkpoint-#1 prompt.
- Scope boundary: Stage-0 only. STOPS at checkpoint-#1.
- Source intent: User message 2026-04-25 "do a multi day dark factory run to implement the prd rigorously".
- Requirement links: ATTR-WEALTHCOM-001 §goal, §scope_in.
- Control graph node: CG-NODE-S0-ATTRACTOR (forthcoming in CG-WEALTHCOM-001).
- KG node: `KG:TB-WC-2026-0425-001`.
- Inputs: PRD artifacts catalog + skill-system reads.
- Outputs (this commit):
  - `runs/wealth-com/02_attractor/meta-attractor-record.json`
  - `runs/wealth-com/02_attractor/product-tailoring-profile.json`
  - `runs/wealth-com/02_attractor/sdlc-stage-coverage-matrix.json`
  - `runs/wealth-com/02_attractor/generated-meta-skill-contract.json`
  - `runs/wealth-com/00_recon/skill-system-survey.md`
  - `runs/wealth-com/02_attractor/tpm-flow-ledger.json` (forthcoming)
  - `runs/wealth-com/02_attractor/factory-pert-plan.json` (forthcoming)
  - `runs/wealth-com/02_attractor/ai-judge-jury-policy.json` (forthcoming)
  - `runs/wealth-com/02_attractor/execution-kernel-state.json` (forthcoming)
  - `runs/wealth-com/02_attractor/next-action-report.json` (forthcoming)
  - `runs/wealth-com/02_attractor/dark-factory-instantiation-record.json` (forthcoming)
  - `runs/wealth-com/09_traceability/knowledge-graph-seed.json` (forthcoming)
  - `runs/wealth-com/03_governance/engagement-governance-record.json` (DRAFT, forthcoming)
  - `runs/wealth-com/12_hawkeye/hawkeye-stage0.json` (forthcoming)
  - This `TASKS.md` ledger.
- Acceptance gate: Hawkeye-Stage0 audit pass + GATE-A through GATE-E pass.
- Evidence required: All Stage-0 records exist, are project-tailored, and Hawkeye conformance audit issues a pass.
- Token SWAG: low ~12K, mid ~20K, high ~35K. Used so far: ~estimated 25K. Within mid band.
- Approval state: pending checkpoint-#1.
- Next bead: TB-WC-2026-0425-002 (PRD re-extraction).
- Re-entry trigger: subagent reports modify scope or atoms.
- Residual risk: PRD-atom subagent could fail self-grep verification → patch bead.

### `TB-WC-2026-0425-002` (queued)
- Objective: Re-extract PRD atoms with strict line-number citation protocol (corrective for INC-001).
- Source intent: INC-001 incident; user demand for "absolute conformance" precludes accepting hallucinated atoms.
- Inputs: wealth_com_PRD_transcript.md (5687 lines), companion files.
- Outputs: prd-atoms.json + prd-canonical.md + prd-extraction-report.json (self-grep verified).
- Acceptance gate: ≥10/10 atom self-grep verification pass.
- Token SWAG: low ~30K, mid ~60K, high ~90K (subagent budget).
- Owner: subagent a9c770a239d1a2f15 (general-purpose, dispatched).

### `TB-WC-2026-0425-003` (queued)
- Objective: Hawkeye-Stage0 independent conformance audit.
- Critical: Hawkeye persona must be DIFFERENT from authoring persona (independence rule). Will be dispatched as separate subagent given only the artifact files (no chat-context handoff).
- Acceptance gate: Hawkeye verdict pass / conditional-pass with explicit findings.
- Owner: hawkeye-auditor-subagent (forthcoming dispatch).

## Open Approvals

| Approval ID | Bead ID | Approver | Decision Needed | Token/Scope Impact | Due | State |
| --- | --- | --- | --- | --- | --- | --- |
| `APP-CHECKPOINT-1` | `TB-WC-2026-0426-005` and downstream | client_owner | Approve HD-001..HD-009 from ATTR-WEALTHCOM-001 | Releases ~150K-1.2M tokens | as soon as packaged | pending |

## Token-Budget Checkpoint Log

| Checkpoint | Bead Range | Low | Mid | High | Assumptions | Approval | Reapproval Trigger |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CHK-0` | TB-001 | 12K | 20K | 35K | Stage-0 only; subagents budgeted separately | self-approved (within attractor authoring) | n/a |
| `CHK-1` | TB-002 + TB-003 + TB-004 | 38K | 70K | 113K | PRD re-extraction + Hawkeye + checkpoint prep | pending client | scope or evidence change |
| `CHK-2-overall-run` | TB-005 through RUN-CLOSED | 150K | 400K | 1.2M | Full multi-day run including all subagents and slices | pending client at checkpoint-#1 | +15% drift / scope change / threshold reduction |

## Validator And Evidence Log

| Run | Tool | Target | Result | Evidence | Follow-Up |
| --- | --- | --- | --- | --- | --- |
| `VAL-001` | Manual review | meta-attractor-record.json | self-pass GATES A-E | this file | Hawkeye-Stage0 audit |
| `VAL-002` | Manual cross-check | INC-001 grep against PRD | confirmed slop | incident-INC-001-prd-agent-slop.json | re-dispatch (TB-002) |
| `VAL-003` | Self-grep | prd-atoms.json | pending (subagent in flight) | n/a | accept atoms only after pass |

## Change Log

| Date | Actor | Bead ID | Change | Rationale | Evidence |
| --- | --- | --- | --- | --- | --- |
| 2026-04-25 | claude-orchestrator | TB-WC-2026-0425-001 | Created bead; authored Stage-0 pack | Initial run setup per user demand | ATTR-WEALTHCOM-001 |
| 2026-04-25 | claude-orchestrator | TB-WC-2026-0425-002 | Created corrective bead for INC-001 | PRD subagent slop required corrective re-extraction | incident-INC-001-prd-agent-slop.json |
