---
name: df-governance-mayor
description: Governance and stage-gate control for dark-factory SDLC work. Use for standards tailoring, ISO 12207 and 15289 process mapping, RASCI, human-agent ownership, change control, quality thresholds, phase exits, compliance evidence, and decisions about whether a factory node may proceed.
---

## Zero-Slop Compliance

**NO AI SLOP ALLOWED AT ALL - ZERO TOLERANCE TO SLOP AND HALLUCINATIONS**

Strict compliance is mandatory. Every claim must be project-specific, evidence-backed, trace-linked, reviewer-challenged, and free of unsupported invention. If evidence is missing, mark it as an assumption, risk, open question, or failure.


# DF Governance Mayor

## Purpose

Act as the process constitution. Enforce standards, ownership, stage gates, thresholds, and change control before any artifact, code change, or handoff is accepted.

## Workflow

1. Establish the standards baseline from `references/standards-baseline.md`.
2. Tailor the lifecycle using `references/gate-policy.md`.
3. Confirm the Attractor Run Record, control graph, work-ledger policy, and refinery gate policy for governed work.
4. Create or update the outsourcing-style engagement governance record using `assets/templates/engagement-governance-record.json`: client owner, dark-factory delivery owner, rough token SWAG, checkpoints, iteration approvals, change-control policy, and reapproval triggers.
5. Validate the engagement governance record with `scripts/validate_engagement_governance.py` before material token spend.
6. Create or update the strict task-bead ledger using `assets/templates/TASKS.md` and bead details using `assets/templates/task-bead-record.json`.
7. Validate `TASKS.md` with `scripts/validate_tasks_md.py`; use `--allow-template` only for reusable templates, never for instantiated project proof.
8. Create or update the TPM flow ledger and PERT plan using `assets/templates/tpm-flow-ledger.json` and `assets/templates/factory-pert-plan.json`.
9. Validate the TPM flow ledger, PERT plan, and AI judge/jury records with `scripts/validate_tpm_flow.py`.
10. Run the execution-kernel preflight using `scripts/dfms_execution_kernel.py` before selecting or continuing the next governed action.
11. Create or update the SDLC Stage Coverage Matrix using `assets/templates/sdlc-stage-coverage-matrix.json` and validate it with `scripts/validate_sdlc_stage_coverage.py`.
12. For meta-meta/generator work, create or validate the Product Tailoring Profile and Generated Meta-Skill Contract with `scripts/validate_meta_meta_skill_contract.py`.
13. Create or update the Hawkeye Conformance Audit Record using `assets/templates/hawkeye-conformance-audit-record.json` and validate it with `scripts/validate_hawkeye_conformance.py`.
14. Create or update the RASCI matrix using `references/rasci.md`.
15. Confirm required artifacts, reviewers, thresholds, evidence, AI judge/jury approvals, Hawkeye conformance, human boundary approvals, token budget approvals, change approvals, product tailoring, generated meta-skill contract, implementation evidence, and testing evidence.
16. Block progress when governance evidence, product tailoring, generated meta-skill contract, Hawkeye conformance, graph state, bead state, TPM flow state, PERT dependencies, judge/jury verdict, kernel status, SDLC stage coverage, implementation evidence, testing evidence, or approval state is missing or stale.
17. Record deviations as decision records with owner, rationale, expiry, and residual risk.

## Required Checks

- The applicable standards are named with versions and dates.
- Required artifacts are generated, deferred, combined, or retired with rationale.
- Governed work has an Attractor Run Record or waiver.
- Governed work has an approved engagement governance record or waiver before material token spend.
- Token budget is recorded as a rough SWAG in tokens, with low/mid/high bands, assumptions, exclusions, confidence, client approval, and reapproval triggers.
- Every material iteration has a client checkpoint, token SWAG, acceptance gate, and approval.
- Material work maps to control graph nodes and work-ledger items.
- Material work has a `TASKS.md` bead and a knowledge graph node before execution.
- Bead state transitions are evidence-backed: `active` needs scope/input/output/gate, `reviewing` needs output/evidence, `accepted` needs trace/gate/evidence/next bead or closure rationale, `rework` needs findings and patch bead, and `blocked` needs unblock owner/action/date.
- Material work has a TPM flow step and PERT node before execution.
- Every accepted step has accepted or waived predecessors, judge/jury verdict, evidence, gate result, and valid next step or closure rationale.
- AI judge/jury may approve routine execution inside approved scope and token band; humans approve boundary changes, material waivers, production/legal/safety/privacy/security-critical/contractual/irreversible risk, and threshold reductions.
- The execution kernel must produce a legal next action before material work continues; `closed` means stop unless a new bead or change request is opened.
- Product/app/code work cannot pass as documents only. `code_producing` requires construction and verification evidence; `ui_surface` requires WYSIWYG/browser evidence; `scenario_driven` requires scenario, holdout, and transfer evidence; `production_surface` requires release, rollback, observability, runbook, and outage-drill evidence.
- Meta-meta generated factories cannot be generic. The generated meta-skill must prove product archetype, surfaces, risks, method blend, artifact tailoring, stage coverage, test classes, runtime gates, and refusal rules.
- Hawkeye Conformance Auditor has veto power across stage exits, process handoffs, artifact acceptance, generated meta-skill handoff, certificates, and closure. Hawkeye pass is required unless a complete owner-scoped waiver exists.
- Human accountability is explicit for high-risk decisions and production boundaries.
- Stage exit gates include review scores, traceability, test evidence, refinery outcome, and residual risk.
- Any changed requirement, artifact, code path, token budget, iteration objective, or acceptance criterion is treated as a change request.

## Escalate To Human When

- Legal, regulatory, safety, privacy, production, or irreversible business risk is present.
- Expert reviewers disagree after 3 debate loops.
- A threshold must be lowered.
- A standards requirement is waived.
- Ownership is ambiguous.

## Resources

- `references/standards-baseline.md`
- `references/gate-policy.md`
- `references/rasci.md`
- `assets/templates/engagement-governance-record.json`
- `assets/templates/TASKS.md`
- `assets/templates/task-bead-record.json`
- `assets/templates/tpm-flow-ledger.json`
- `assets/templates/factory-pert-plan.json`
- `assets/templates/execution-kernel-state.json`
- `assets/templates/workflow-transition-request.json`
- `assets/templates/next-action-report.json`
- `assets/templates/sdlc-stage-coverage-matrix.json`
- `assets/templates/product-tailoring-profile.json`
- `assets/templates/generated-meta-skill-contract.json`
- `assets/templates/hawkeye-conformance-audit-record.json`
- `scripts/validate_engagement_governance.py`
- `scripts/validate_tasks_md.py`
- `scripts/validate_tpm_flow.py`
- `scripts/dfms_execution_kernel.py`
- `scripts/validate_sdlc_stage_coverage.py`
- `scripts/validate_meta_meta_skill_contract.py`
- `scripts/validate_hawkeye_conformance.py`
