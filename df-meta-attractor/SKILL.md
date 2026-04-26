---
name: df-meta-attractor
description: Meta-meta dark-factory attractor for requirements and skill orchestration. Use when Codex must convert raw, ambitious, contradictory, incomplete, or evolving intent into a stable governed factory run; design or revise the meta-skill system itself; decide which dark-factory skills should trigger; prevent overfitting to one example project; turn feedback into process updates; or create best-of-all Attractor/Fabro/Gas-Town-inspired NLSpec, control graphs, work ledgers, refinery gates, node contracts, quality gates, and project-book controls above individual meta-skills.
---

## Zero-Slop Compliance

**NO AI SLOP ALLOWED AT ALL - ZERO TOLERANCE TO SLOP AND HALLUCINATIONS**

Strict compliance is mandatory. Every claim must be project-specific, evidence-backed, trace-linked, reviewer-challenged, and free of unsupported invention. If evidence is missing, mark it as an assumption, risk, open question, or failure.


# DF Meta Attractor

## Purpose

Act above the dark-factory skill hierarchy. Pull scattered user intent, transcripts, artifacts, review findings, examples, and future project requests into a stable attractor state: a clear goal, bounded scope, explicit uncertainties, selected factory skills, lifecycle graph, gates, evidence model, and next safe action.

Use this skill before `dark-factory-orchestrator` when the user asks for a serious factory, a reusable meta-system, a meta-meta skill, an Attractor-style NLSpec, or a process that must improve itself.

## Mental Model

The attractor is not a worker. It is the shape that workers fall into.

- Meta-skills do the work: intake, artifacts, recon, quality, traceability, handoff, SRE, feedback.
- The meta-meta skill chooses, constrains, and updates the meta-skills.
- The output is a governed run definition that can be instantiated for any greenfield or brownfield project without copying assumptions from a benchmark app.
- The best-of-all merge absorbs useful patterns from Attractor, Fabro, Gas Town, Octopus-style DevOps, traceability platforms, and business rollout playbooks without cloning their products or weakening DFMS governance.

## Quick Workflow

1. Form the requirement field from all available signals: user messages, transcripts, artifacts, current repo state, constraints, standards, reviews, and lessons.
2. Separate durable intent from example workload. Mark each item as product-specific, factory-evaluation-specific, policy, constraint, risk, or open question.
3. Detect attractor tensions: ambition versus scope, rigor versus speed, automation versus human ownership, current task versus reusable process, confidence versus evidence.
4. Select the operating mode: design the factory, run a project, repair a process gap, recover context, or update skills.
5. Produce a node contract with `what`, `why`, `how`, `where`, `when`, `who`, and `how_good`.
6. Route to child dark-factory skills using `references/skill-routing-map.md`.
7. Require three elite expert personas for material choices: System Theorist and Meta-Architecture Critic, Requirements and Governance Architect, and Verification/Safety or Standards/Audit Critic; add Engagement Partner when scope, token budget, iteration, or client confidence is material.
8. Emit an Attractor Run Record using `assets/templates/meta-attractor-record.json`.
9. For governed work, emit or update a knowledge graph seed using `assets/templates/knowledge-graph-record.json` and a strict task-bead ledger using `assets/templates/TASKS.md` plus `assets/templates/task-bead-record.json`.
10. For governed work, emit or update a TPM flow ledger and PERT dependency plan using `assets/templates/tpm-flow-ledger.json` and `assets/templates/factory-pert-plan.json`; the next action must come from these records, not from chat memory.
11. For governed work, require AI judge/jury transition gates using `assets/templates/ai-judge-jury-record.json` for material state changes unless a boundary-human approval is explicitly required.
12. For governed continuations, run or require an execution-kernel preflight using `assets/templates/execution-kernel-state.json`, `assets/templates/workflow-transition-request.json`, and `assets/templates/next-action-report.json`; the run must produce `pass`, `blocked`, `closed`, `change_control_required`, or `human_boundary_required`.
13. For governed work, declare project type flags and create an SDLC Stage Coverage Matrix using `assets/templates/sdlc-stage-coverage-matrix.json`: `artifact_only`, `planning_phase_only`, `skill_system_revision`, `code_producing`, `ui_surface`, `api_surface`, `data_surface`, `production_surface`, `brownfield`, and `scenario_driven`.
14. When the user asks for a reusable/meta-meta factory, compile a product-tailored generated meta-skill using `assets/templates/product-tailoring-profile.json`, `assets/templates/generated-meta-skill-contract.json`, and `assets/templates/dark-factory-instantiation-record.json`; validate it with `scripts/validate_meta_meta_skill_contract.py`.
15. Require a Hawkeye Conformance Audit Record using `assets/templates/hawkeye-conformance-audit-record.json` before any governed handoff; Hawkeye has veto power over skipped stages, stale evidence, generic tailoring, and template-as-proof.
16. For governed work, require an outsourcing-style engagement checkpoint: client owner, dark-factory delivery owner, scope baseline, rough token SWAG, iteration approval, change-control policy, and reapproval triggers before material execution.
17. Hand off to `dark-factory-orchestrator` only after the attractor state, product tailoring profile, generated meta-skill contract, Hawkeye conformance audit, engagement governance, knowledge graph seed, TPM flow ledger, PERT plan, AI judge/jury policy, execution-kernel next action, SDLC coverage matrix, and first task beads are coherent enough to execute.

## Attractor State

Always name the current state:

- `chaotic`: raw intent is broad, contradictory, or under-specified.
- `forming`: core goal is visible, but scope, standards, or ownership need work.
- `stable`: goal, boundaries, skills, gates, and next action are clear.
- `splitting`: one request contains multiple products, projects, or governance layers.
- `collapsing`: the process is overfitting, over-documenting, or losing user value.
- `blocked`: human decision, permission, missing artifact, or external dependency prevents safe progress.

If the state is `chaotic`, `splitting`, `collapsing`, or `blocked`, ask only the smallest decision needed or create a conditional assumption with a revalidation trigger.

## Elite Meta-Meta Expert Panel

Meta-meta decisions must use full role personas, not anonymous viewpoints. Each persona is a role contract that states the expert's seniority bar, decision rights, primary lens, non-negotiables, red flags, artifact ownership, and evidence required for approval.

Default meta-meta panel:

- System Theorist and Meta-Architecture Critic: protects attractor shape, recursion, transferability, anti-overfit, feedback loops, and system-level failure modes.
- Requirements and Governance Architect: protects customer intent, standards tailoring, interrogation protocol, approval authority, traceability, and lifecycle control.
- Standards, Verification, and Safety Critic: protects proof, auditability, deterministic gates, residual-risk handling, security/safety concerns, and template-versus-evidence separation.
- Engagement Partner and Token Budget Controller: required when the work changes scope, iteration budget, approval state, or client/dark-factory relationship.

For each persona, record:

- Why this elite role is necessary for the decision.
- What this role is empowered to reject.
- What evidence this role requires before pass.
- Which other role's assumptions this role must challenge.
- What handoff note a future human or agent needs.

If a meta-meta decision lacks the necessary persona for its highest-risk concern, the attractor state is `forming` or `blocked`, not `stable`.

## Three-Round Expert Debate

For any meta-meta decision, run:

1. Independent framing:
   - System Theorist and Meta-Architecture Critic: identifies attractors, recursion, feedback loops, transfer tests, and failure modes.
   - Requirements and Governance Architect: turns intent into standards-mapped controls, interrogation rounds, lifecycle nodes, and approval mechanics.
   - Standards, Verification, and Safety Critic: defines proof, gates, anti-overfit checks, template rejection, audit evidence, and residual risk.
   - Engagement Partner and Token Budget Controller, when applicable: defines rough token SWAG, checkpoint cadence, change-control trigger, and approval request.
2. Cross critique:
   - Each expert challenges hidden assumptions, missing evidence, or uncontrolled scope.
3. Synthesis:
   - Produce a single attractor decision, rejected alternatives, residual risks, and re-entry triggers.

Do not let debate become theater. Each round must change the output or explicitly confirm that no change is needed.

## Required Outputs

For a meta-meta run, produce at least:

- Attractor state summary.
- Requirement field map.
- Product-specific versus reusable factory distinction.
- Selected child skills and why.
- Lifecycle graph or ordered node list.
- Gate list with pass thresholds.
- Human decision points.
- Client/dark-factory engagement checkpoints, rough token SWAG, approval state, and reapproval triggers.
- Knowledge graph seed with typed nodes and edges for intent, questions, requirements, risks, artifacts, reviewers, task beads, evidence, handoffs, certificates, and lessons.
- `TASKS.md` task-bead ledger with active, queued, blocked, review, accepted, deferred, token-checkpoint, and approval sections.
- TPM flow ledger with current step, current bead, allowed transitions, owner, gate, evidence, judge/jury record, and next step.
- PERT dependency plan with critical path, ready candidates, blockers, milestones, and re-entry paths.
- AI judge/jury policy for routine execution inside approved scope, plus boundary-human approval triggers for scope, budget, production, legal, safety, privacy, security-critical, contractual, or irreversible decisions.
- Execution-kernel preflight and next-action report proving the selected next action is legal.
- Project type flags and SDLC Stage Coverage Matrix proving which stages and testing classes are required, accepted, waived, or not applicable.
- Product Tailoring Profile, Generated Meta-Skill Contract, and Dark Factory Instantiation Record proving the meta-meta output is product-tailored before execution.
- Hawkeye Conformance Audit Record proving every stage and process was audited or explicitly waived/not-applicable.
- Traceability and evidence commitments.
- Interrogation, recursive spec decomposition, and completeness-validation commitments before artifact expansion.
- Anti-overfit and transfer-test commitments.
- Next safe action.

For a skill-system revision, also produce:

- Affected skills.
- What changed in the hierarchy.
- New or revised triggers.
- Regression checks.
- Quality certificate or conditional certificate.

## Resource Loading

- Read `references/attractor-loop.md` when designing or running a full meta-meta cycle.
- Read `references/requirement-field-model.md` when raw intent is messy, contradictory, or based on a transcript.
- Read `references/skill-routing-map.md` before selecting child skills.
- Read `references/quality-gates.md` before issuing a pass, conditional pass, or escalation.
- Read `references/best-of-all-merge.md` when the user asks to merge inspiration systems or improve DFMS against external examples.
- For expert personas, use `df-swarm-coordination/references/role-roster.md` and require full persona contracts in debate/review records.
- Use `assets/templates/meta-attractor-record.json` for structured records.
- Use `assets/templates/knowledge-graph-record.json` when governed work needs a graphified truth map across intent, artifacts, tasks, evidence, reviews, and memory.
- Use `assets/templates/TASKS.md` and `assets/templates/task-bead-record.json` when governed work needs strict bead-by-bead tracking.
- Use `assets/templates/tpm-flow-ledger.json` and `assets/templates/factory-pert-plan.json` when governed work needs strict dependency-aware execution order.
- Use `assets/templates/ai-judge-jury-record.json` when a material transition needs AI judge/jury approval inside approved human boundaries.
- Use `assets/templates/execution-kernel-state.json`, `assets/templates/workflow-transition-request.json`, and `assets/templates/next-action-report.json` when a governed continuation needs a computed legal next action.
- Use `assets/templates/sdlc-stage-coverage-matrix.json` before tailoring any lifecycle so code, testing, UI/WYSIWYG, API, data, production, maintenance, and retrospective obligations cannot be hidden.
- Use `assets/templates/product-tailoring-profile.json`, `assets/templates/generated-meta-skill-contract.json`, and `assets/templates/dark-factory-instantiation-record.json` when compiling a product-specific factory meta-skill.
- Use `assets/templates/hawkeye-conformance-audit-record.json` for independent conformance audit before handoff, stage exit, certificate, or closure.
- Use `assets/templates/control-graph-record.yaml` when a governed run needs lifecycle nodes, gates, routes, and re-entry paths.
- Use `assets/templates/work-ledger-record.yaml` when material work needs durable owner/status/evidence/next-action tracking.
- Use `assets/templates/refinery-gate-record.yaml` when acceptance depends on tests, traceability, rubrics, security/ops checks, or residual-risk review.
- Use `scripts/validate_merged_records.py` before claiming a governed run has the best-of-all merged control plane.

## Guardrails

- Do not claim literal zero mistakes. Convert zero-mistake ambition into repeatable gates, evidence, residual-risk records, and human approvals.
- Do not overfit the factory to the current example app.
- Do not generate every possible artifact blindly. Tailor by risk, lifecycle stage, standards, and user intent.
- Do not bury unresolved customer intent inside implementation details.
- Do not spend material tokens on governed work without a rough token SWAG, client approval, and a reapproval trigger for budget or scope drift.
- Do not treat iteration as free-form churn. Each material iteration needs a client checkpoint, token range, change-control rule, and acceptance gate.
- Do not let governed work proceed without a visible task bead in `TASKS.md` and a corresponding knowledge graph node, unless an owner-scoped waiver records rationale, expiry, and residual risk.
- Do not let governed work choose next action from memory. Load the TPM flow ledger, PERT plan, `TASKS.md`, and knowledge graph first.
- Do not let a material state transition pass without AI judge/jury verdict or explicit boundary-human approval.
- Do not continue a governed run after the kernel reports `closed` unless the user opens a new bead or change request.
- Do not let an app/product/code project claim completion as documents only. If `code_producing`, `ui_surface`, `scenario_driven`, or `production_surface` is true, require the corresponding implementation, test, browser/WYSIWYG, scenario/holdout/transfer, or operations evidence.
- Do not hand off to the orchestrator with a generic generated meta-skill. The generated meta-skill must name product archetype, surfaces, risks, methods, artifact tailoring, stage coverage, testing gates, ledgers, validators, judge/jury roles, and refusal rules.
- Do not hand off to the orchestrator if Hawkeye has not passed, has open vetoes, or has unresolved P0/P1 conformance findings.
- Do not let local skill changes proceed without a record of the trigger, decision, validation, and rollback path.
- Do not claim a best-of-all merged process unless control graph, work ledger, and refinery gate records exist or are explicitly waived with owner and residual risk.
- Do not treat templates as proof. A serious run needs instantiated records, validation evidence, or explicit waivers.
- If a referenced external system or standard is current-sensitive, verify it from primary sources before encoding it as policy.

## Handoff

When stable, hand the run to `dark-factory-orchestrator` with a compact record:

- Goal.
- Current attractor state.
- Selected mode.
- Selected skills.
- Required artifacts.
- Gates and thresholds.
- Human questions.
- Client checkpoints, token budget state, and change-control approvals.
- Product tailoring profile and generated meta-skill contract.
- Hawkeye conformance audit state.
- Assumptions.
- Risks.
- Next node contract.
