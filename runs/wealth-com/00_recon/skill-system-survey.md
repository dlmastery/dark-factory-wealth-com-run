# Dark-Factory Skill System Survey

**Run:** RUN-WEALTHCOM-001
**Authored:** 2026-04-25 by claude-orchestrator
**Sources:** Direct reads of all 14 SKILL.md files, ~30 reference files, and ~25 template JSON/YAML files at `C:\Users\abhir\version2\` (paths below). Validated against my own context.
**Provenance:** This file was authored from primary reads, not synthesized from a subagent. Independent of the Explore-agent draft (`a8f0b5f2b3c108c92`); that draft was used as a checklist only.

---

## 0. System Inventory

| # | Bundle | Role |
|---|---|---|
| 1 | `dark-factory-orchestrator` | Lifecycle conductor (post-attractor) |
| 2 | `df-meta-attractor` | Meta-meta gravity well; converts intent → governed run |
| 3 | `df-governance-mayor` | Process constitution; gates, RASCI, change control, validators |
| 4 | `df-intake-spec-lab` | Recursive spec decomposition; interrogation |
| 5 | `df-brownfield-recon` | Existing-repo discovery + change-impact (NOT used in this greenfield run) |
| 6 | `df-artifact-factory` | BRD/SRS/HLD/LLD/ADR/runbook/certificate authoring |
| 7 | `df-methodology-blender` | RUP+MDA+DDD+TDD+SRE+SSDF blend |
| 8 | `df-swarm-coordination` | 3-expert debate + AI judge/jury per state transition |
| 9 | `df-quality-refinery` | RALPH 5-loop + rubrics + adversarial critics + certificate |
| 10 | `df-traceability-evidence` | Knowledge graph + 35 typed link classes + validators |
| 11 | `df-context-memory` | Compact context packs; predecessor recovery; resume safety |
| 12 | `df-human-agent-handoff` | Bidirectional handoff; taste gates; async review |
| 13 | `df-production-sre-handoff` | Release readiness; outage drill; operator signoff |
| 14 | `df-feedback-learning` | Lessons → skill-system updates; regression checks |

Total: **14 bundles** (user said "16" — there are exactly 14 present in `C:\Users\abhir\version2\`. Logged as ASM-006: clarify with user during checkpoint-#1.)

---

## 1. Required Records (Stage-0 acceptance set)

The dark-factory-orchestrator's `## Start Here` rules + df-meta-attractor's `Quick Workflow` together demand **the following records exist before any material work proceeds**:

| # | Record | Schema | Purpose |
|---|---|---|---|
| 1 | Attractor Run Record | `meta-attractor-record.json` | Goal, scope, mode, gates, expert debate, next safe action |
| 2 | Knowledge Graph seed | `knowledge-graph-record.json` | Typed nodes/edges across intent → bead → evidence |
| 3 | TASKS.md bead ledger | `TASKS.md` | Active/queued/blocked/review/accepted/deferred beads |
| 4 | Per-bead detail | `task-bead-record.json` | Source, gate, evidence, dependency, child beads |
| 5 | TPM Flow Ledger | `tpm-flow-ledger.json` | Sequenced steps with allowed transitions, predecessor/successor |
| 6 | PERT Plan | `factory-pert-plan.json` | Critical path, parallel ready, blockers, milestones |
| 7 | AI Judge/Jury Policy | `ai-judge-jury-record.json` | TPM Judge + Evidence Clerk + 3 jurors + Adversarial Prosecutor + Foreperson |
| 8 | Execution Kernel State | `execution-kernel-state.json` | Cross-validation of TASKS/TPM/PERT/KG → legal next action |
| 9 | Workflow Transition Request | `workflow-transition-request.json` | Per state movement |
| 10 | Next Action Report | `next-action-report.json` | What to do now, why, blocked-by, kernel result |
| 11 | SDLC Stage Coverage Matrix | `sdlc-stage-coverage-matrix.json` | 17 required stages × status + per-surface testing classes |
| 12 | Product Tailoring Profile | `product-tailoring-profile.json` | Archetype, surface flags, risk, methodology blend |
| 13 | Generated Meta-Skill Contract | `generated-meta-skill-contract.json` | Compile-time outputs, runtime gates, surface-gate mapping |
| 14 | Dark Factory Instantiation Record | `dark-factory-instantiation-record.json` | Pointer to all instantiated records |
| 15 | Engagement Governance Record | `engagement-governance-record.json` | Client/delivery owner, scope, token SWAG, checkpoints |
| 16 | Hawkeye Conformance Audit Record | `hawkeye-conformance-audit-record.json` | Independent veto-bearing audit |

**Optional supporting records:**

| # | Record | Schema | When |
|---|---|---|---|
| 17 | Control Graph | `control-graph-record.yaml` | Lifecycle nodes + gates + re-entry |
| 18 | Work Ledger | `work-ledger-record.yaml` | Durable work-item state |
| 19 | Refinery Gate Record | `refinery-gate-record.yaml` | Per-gate verdict |

---

## 2. Per-Bundle Quick-Reference

### `dark-factory-orchestrator`
- **Refs:** `routing.md`, `lifecycle-map.md`, `standards-baseline.md`
- **Templates:** `node-contract.json`
- **Standards baseline:** ISO/IEC/IEEE 12207:2017, 15289:2019, 42001:2023 (AI mgmt), NIST SSDF 800-218, OWASP SAMM, OMG MDA, UML 2.5.1, CMMI V3.0
- **Lifecycle stages:** Meta-attractor → Intake → Feasibility → Inception → Elaboration → Planning → Construction → Verification → Transition → Operation → Maintenance → Retrospective
- **Default gate thresholds:** Governance 98%, expert minimum 96%, traceability 100%, P0/P1 security 0

### `df-meta-attractor`
- **Refs:** `attractor-loop.md`, `requirement-field-model.md`, `skill-routing-map.md`, `quality-gates.md` (Gates A-E: Coherence, Recursion, Routing, Evidence, Anti-Overfit), `best-of-all-merge.md`
- **States:** chaotic, forming, stable, splitting, collapsing, blocked
- **Default panel:** System Theorist, Requirements/Governance Architect, Standards/Verification Critic, +Engagement Partner when scope/budget material
- **3-round debate:** independent framing → cross critique → synthesis

### `df-governance-mayor`
- **Refs:** `standards-baseline.md`, `gate-policy.md` (5 default gates: Intake, Elaboration, Construction, Verification, Transition), `rasci.md`
- **Templates:** all 12 governance records (engagement, TASKS, beads, TPM, PERT, kernel, SDLC, tailoring, contract, hawkeye)
- **Validators:** validate_engagement_governance, validate_tasks_md, validate_tpm_flow, dfms_execution_kernel, validate_sdlc_stage_coverage, validate_meta_meta_skill_contract, validate_hawkeye_conformance
- **Threshold rule:** lowering requires decision record + human owner

### `df-intake-spec-lab`
- **Refs:** `intake-question-bank.md`, `interrogation-protocol.md`, `spec-decomposition-protocol.md`, `spec-quality-rubric.md`
- **Templates:** `interrogation-record.json`, `spec-decomposition-record.json`
- **Validators:** validate_spec_decomposition, validate_intake_package
- **Decomposition:** vision → capability → journey → feature → rule/data/event → NFR → acceptance-test leaf

### `df-brownfield-recon`
- **Refs:** `codebase-recon-playbook.md`, `change-impact-template.md`
- **Rule:** no refactor unrelated code while making behavior change; no overwrite user work
- **Output:** change-impact record before implementation
- **NOT loaded in this run** (greenfield)

### `df-artifact-factory`
- **Refs:** `artifact-catalog.md` (63-artifact catalog with classes GOV/REQ/ARC/MDA/DDD/IMP/VNV/REL/EVD), `artifact-tailoring.md`, `assets/artifact-template-library/index.json`
- **Templates:** artifact-record, decision-record, quality-certificate, implementation-execution-record, scenario-test-matrix, wysiwyg-browser-test-record
- **Rule:** prefer compact + dense; alternatives + rationale required; never docs-only for code/UI/scenario/production work
- **Per-artifact panel:** ≥3 specialist critics + ≥2 adversarial + ≥5 RALPH loops

### `df-methodology-blender`
- **Refs:** `rup-mda-ddd-tdd.md`
- **Templates:** methodology-blend-record, product-tailoring-profile, generated-meta-skill-contract, sdlc-stage-coverage-matrix, scenario-test-matrix
- **Output:** Methodology Tailoring Matrix (method × artifacts × gates × reviewers × evidence × control-graph nodes × refinery gates × test classes)
- **UI/WYSIWYG addendum:** Playwright/browser obligations (desktop/mobile screenshots, console/network, viewport, layout, a11y)

### `df-swarm-coordination`
- **Refs:** `role-roster.md` (elite persona contracts: seniority, decision rights, primary lens, non-negotiables, signature questions, artifact ownership, adversarial duties, red flags, handoff note), `debate-protocol.md` (7 rounds)
- **Templates:** expert-debate-record, ai-judge-jury-record
- **AI Judge/Jury required roles:** TPM Judge, Evidence Clerk, Standards Juror, Domain/Artifact Juror, Verification Juror, Adversarial Prosecutor, Jury Foreperson
- **Pass criteria:** TPM+Clerk pass + ≥3 specialist juror pass + prosecutor stand-down (or patch beads) + no P0/P1 + explicit next step

### `df-quality-refinery`
- **Refs:** `expert-rubrics.md`, `artifact-critic-panel-matrix.md` (per-artifact panel selection), `artifact-rubric-library/index.json` (18 artifact-level checks + 15 per critic seat), `review-thresholds.md` (96% per expert)
- **Templates:** artifact-review-panel-record, artifact-ralph-loop-record, rubric-score-record, refinery-gate-record (.yaml), quality-certificate, ai-judge-jury-record, implementation-execution-record, scenario-test-matrix, wysiwyg-browser-test-record, hawkeye-conformance-audit-record
- **Validators:** validate_artifact_review_panel, validate_artifact_ralph_loop, validate_artifact_rubric_library, score_rubric_matrix, validate_refinery_gate, validate_quality_certificate
- **RALPH loop:** Review → Attack → Learn → Patch → Harden, ≥5 rounds
- **Anti-slop triggers:** generic statements; standards named without mapping; reqs without acceptance tests; serious-factory work without Attractor Record; governed work without control-graph/work-ledger/refinery-gate; benchmark wins without holdout/transfer; threshold lowered <96% without owner waiver

### `df-traceability-evidence`
- **Refs:** `trace-schema.md` (35 link classes: derives_from, satisfies, implements, verifies, mitigates, decides, supersedes, depends_on, accepted_by, raises, routes_to, tracked_by, gated_by, refines, owns, reviewed_by, answers, revalidated_by, attacked_by, requires_patch, patched_by, hardened_by, certified_by, waived_by, hands_off_to, resumes_from, learns_from, next_bead, flow_step_for, pert_depends_on, transition_judged_by, implemented_by, tested_by, scenario_covers, browser_verified_by, stage_covered_by, audited_by, conformance_verified_by), `evidence-schema.md`
- **Templates:** requirement-record, evidence-record, knowledge-graph-record
- **Validators:** validate_trace_links (use --strict for governed runs; --evidence-file for file refs), validate_knowledge_graph
- **Strict rejection rules:** unresolved edges; orphan material nodes; accepted bead w/o evidence/gate/next; accepted artifact w/o rubric/review/RALPH/cert; templates as proof; flow steps w/ unmet predecessors

### `df-context-memory`
- **Refs:** `context-budgeting.md`, `project-book-index.md`, `predecessor-recovery.md`
- **Templates:** context-pack-record, knowledge-graph-record, TASKS.md, tpm-flow-ledger, factory-pert-plan, execution-kernel-state, next-action-report, hawkeye-conformance-audit-record
- **Resume rule:** TASKS.md authoritative; chat memory never authoritative; if kernel says `closed`, create new bead before resuming

### `df-human-agent-handoff`
- **Refs:** `takeover-protocol.md`, `async-review.md`
- **Templates:** handoff-record, human-communication-record
- **Patterns:** async review (acknowledge-classify-link-incorporate-reverify), confidence framing, informal clarification lane (promote if scope-changing), taste gate, disagreement escalation

### `df-production-sre-handoff`
- **Refs:** `release-readiness.md`, `sre-runbook.md`
- **Templates:** production-handoff-record, outage-drill-record
- **Validator:** validate_production_handoff (bundle mode: --outage-drill + --control-graph + --work-ledger + --refinery-gate + --evidence-file)
- **Approval rule:** production approval stays with accountable human

### `df-feedback-learning`
- **Refs:** `retrospective-loop.md` (cadence: failed gate, human review, incident, phase exit, standards change), `standards-watch.md`
- **Output:** lesson record + change request + regression check
- **Token rule:** if lesson changes scope/iteration/acceptance/standards/token forecast → require client approval

---

## 3. Routing Matrix (intent → primary skill → output)

| User intent | Primary skill | Secondary | Output |
|---|---|---|---|
| Ambiguous serious factory request, transcript-driven, "absolute conformance" | `df-meta-attractor` | `dark-factory-orchestrator` | Attractor Run Record + tailoring + 13-record Stage-0 pack |
| Greenfield product build | `dark-factory-orchestrator` → `df-intake-spec-lab` | artifact-factory, methodology-blender, swarm, quality, trace | Recursive spec, BRD/SRS, HLD, code, evidence, certificate |
| Standards/RASCI/threshold/change-control | `df-governance-mayor` | (per workflow) | Engagement record, validated TASKS.md, next-action |
| Recursive spec decomposition | `df-intake-spec-lab` | swarm (for taste-gate questions) | interrogation-record, spec-decomposition-record |
| BRD/SRS/HLD/LLD/ADR/runbook | `df-artifact-factory` | quality-refinery, traceability-evidence | per-artifact record + RALPH log + critic panel |
| RUP+DDD+TDD+SRE blend | `df-methodology-blender` | governance-mayor | methodology-blend-record + scenario-test-matrix |
| 3-expert debate, AI judge/jury per transition | `df-swarm-coordination` | (any) | expert-debate-record, ai-judge-jury-record |
| RALPH 5-loop, rubric scoring, certificate | `df-quality-refinery` | swarm, traceability | refinery-gate-record + quality-certificate |
| Trace closure, KG, evidence ledger | `df-traceability-evidence` | artifact-factory, quality-refinery | knowledge-graph-record + validate_trace_links report |
| Resume long work, prevent context rot | `df-context-memory` | traceability, governance | context-pack-record + recovery notes |
| Human-agent handoff, taste gate, async review | `df-human-agent-handoff` | context-memory, governance | handoff-record + human-communication-record |
| Release/SRE/runbook/outage drill | `df-production-sre-handoff` | traceability, human-handoff | production-handoff-record + outage-drill-record |
| Feedback → process improvement | `df-feedback-learning` | governance (if scope/token impact) | lesson record + change request + regression check |

---

## 4. Stage-0 Wiring for the Wealth.com Run

For RUN-WEALTHCOM-001, Stage-0 outputs are linked as follows:

- Attractor Run Record `ATTR-WEALTHCOM-001` ← references all other Stage-0 records
- Engagement Governance `ENG-GOV-WEALTHCOM-001` ← gates material work; awaits checkpoint-#1
- KG seed `KG-WEALTHCOM-001` ← typed nodes for every intent/requirement/risk/bead/lesson
- TASKS.md ← single bead ledger for the run; first bead `TB-WC-2026-0425-001` = "Stage-0 pack drafting (in flight)"
- TPM Flow Ledger `TPM-FLOW-WEALTHCOM-001` ← step `STEP-001` = "Stage-0 attractor + governance"
- PERT plan `PERT-WEALTHCOM-001` ← critical path includes checkpoint-#1 → intake → elaboration
- Judge/Jury Policy `JURY-POLICY-WEALTHCOM-001` ← personas for routine vs boundary-human triggers
- Execution Kernel State `KERNEL-WEALTHCOM-001` ← preflight result `human_boundary_required` (checkpoint-#1)
- Next Action Report `NEXT-ACTION-WEALTHCOM-001-stage0` ← legal_next_action = "client approval at checkpoint-#1"
- SDLC Coverage `SDLC-COVERAGE-WEALTHCOM-001` ← all 17 stages declared with status
- Product Tailoring `PRODUCT-TAILORING-WEALTHCOM-001` ← regulated_or_high_assurance=true; surface flags=all-true except brownfield
- Generated Meta-Skill `GENERATED-META-SKILL-WEALTHCOM-001` ← name = "wealthcom-fintech-ai-saas-greenfield-meta-skill"
- DF Instantiation `DF-INSTANTIATION-WEALTHCOM-001` ← pointers to all above
- Hawkeye `HAWKEYE-WEALTHCOM-001-stage0` ← independent persona; logs the INC-001 PRD-agent slop incident as conformance evidence

---

## 5. Discrepancies / Open Items

- ASM-006: User mentioned "16" skills; only 14 bundles present. Verify at checkpoint-#1.
- INC-001 logged: PRD-extraction subagent slop. Re-dispatch as general-purpose with strict line-number citation protocol. See `runs/wealth-com/11_feedback/incident-INC-001-prd-agent-slop.json`.
- Domain-research subagent (ad2487c326e8732a0) still in flight as of authoring time.
