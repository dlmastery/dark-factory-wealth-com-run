---
name: df-swarm-coordination
description: Expert role assignment, recursive decomposition, debate rounds, alternative design synthesis, critic panels, and multi-agent coordination for dark-factory nodes. Use when a task requires 3 expert viewpoints, parallel proposals, cross-critique, consensus, escalation, or decomposition into smaller work units.
---

## Zero-Slop Compliance

**NO AI SLOP ALLOWED AT ALL - ZERO TOLERANCE TO SLOP AND HALLUCINATIONS**

Strict compliance is mandatory. Every claim must be project-specific, evidence-backed, trace-linked, reviewer-challenged, and free of unsupported invention. If evidence is missing, mark it as an assumption, risk, open question, or failure.


# DF Swarm Coordination

## Purpose

Make multi-expert work disciplined. Assign roles, run independent reasoning, force critique, synthesize alternatives, and escalate when confidence is not earned.

The panel is not a decorative list of voices. Each selected role must be treated as an elite industry expert persona with a documented lens, seniority bar, decision rights, non-negotiables, adversarial duties, red flags, and artifact ownership.

## Workflow

1. Select a moderator and 3 primary experts from `references/role-roster.md`; add specialists when risk requires it.
2. Record each selected expert's full persona contract: `role_id`, `persona_summary`, `seniority_bar`, `decision_rights`, `primary_lens`, `non_negotiables`, `signature_questions`, `artifact_ownership`, `adversarial_duties`, `red_flags`, and `handoff_note`.
3. Decompose work until each node has a clear output and verification path.
4. Create an Expert Debate Record using `assets/templates/expert-debate-record.json`.
5. Run the debate protocol in `references/debate-protocol.md`.
6. Record alternatives, critiques, dissent, decision, residual risk, required evidence, and re-entry triggers.
7. Link the debate record to the control graph node, work-ledger item, decision record, trace evidence, and refinery gate.
8. For material workflow transitions, create an AI Judge/Jury Record using `assets/templates/ai-judge-jury-record.json` before the transition is accepted.
9. Send outputs to `df-quality-refinery` and `df-traceability-evidence`.

## Debate Rounds

1. Context prime.
2. Persona declaration: each expert states why their role is needed, what they will reject, and what proof they require.
3. Independent proposals.
4. Cross critique.
5. Alternative synthesis.
6. Decision vote.
7. Verification plan.
8. Certificate or escalation.

## AI Judge And Jury Transition Gate

Use this when a governed step moves to `accepted`, `rework`, `blocked`, `waived`, `closed`, or any state that changes what happens next.

Required roles:

- TPM Judge: rejects skipped dependencies, illegal state transitions, missing current/next step, stale work, owner gaps, and weak checkpointing.
- Evidence Clerk: rejects missing evidence, placeholders, template-as-proof, stale validation, and unsupported claims.
- Standards Juror: rejects unmapped lifecycle or standards claims.
- Domain/Artifact Juror: rejects outputs that do not satisfy project-specific requirements and artifact rubrics.
- Verification Juror: rejects weak tests, unverified NFRs, untested risks, and missing validator evidence.
- Adversarial Prosecutor: attacks slop, reward hacking, fake completion, hidden assumptions, skipped steps, and context-rot failure.
- Jury Foreperson: synthesizes votes, preserves dissent, chooses pass/rework/blocked/waived/closed, and creates patch beads when needed.

Pass requires TPM Judge pass, Evidence Clerk pass, at least three specialist juror pass votes, adversarial prosecutor stand-down or patch beads, no open P0/P1 workflow finding, and explicit next step or closure rationale.

## Elite Persona Enforcement

- The expert persona is a role contract, not a claim that a named external expert participated.
- Each expert must behave as if accountable for signing the artifact in a serious client delivery program.
- Each expert must identify at least one failure mode outside their own specialty.
- Each expert must challenge at least one other expert's assumption or explicitly state why it survives scrutiny.
- The panel chair must preserve dissent, not smooth it away.
- A debate is invalid if roles are generic, interchangeable, or unable to name what they would reject.
- A serious governed node must cover business intent, engineering feasibility, verification proof, and governance/approval risk through the selected roles.
- For meta-meta, skill-system, or "best of all" work, the required panel is System Theorist and Meta-Architecture Critic, Requirements and Governance Architect, and Standards/Compliance/Audit Lead; add Engagement Partner when scope, budget, or iteration is material.

## Escalate When

- The experts disagree after 3 loops.
- The task is too large to verify.
- The decision changes business, legal, safety, production, security, or irreversible architecture risk.
- The panel lacks a necessary elite persona for a material risk.
- A role cannot state decision rights, non-negotiables, red flags, and proof obligations.
- The TPM Judge or Evidence Clerk refuses the transition.
- The adversarial prosecutor does not stand down and no patch bead is created.

## Resources

- `references/role-roster.md`
- `references/debate-protocol.md`
- `assets/templates/expert-debate-record.json`
- `assets/templates/ai-judge-jury-record.json`
