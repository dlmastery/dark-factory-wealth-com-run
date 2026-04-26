---
name: df-artifact-factory
description: Standards-based SDLC artifact generation and maintenance for dark-factory projects. Use to create or update BRD, SRS, NFR catalog, HLD, LLD, ADRs, MDA CIM/PIM/PSM models, DDD maps, test plans, traceability matrices, release notes, runbooks, incident guides, maintenance guides, and quality certificates.
---

## Zero-Slop Compliance

**NO AI SLOP ALLOWED AT ALL - ZERO TOLERANCE TO SLOP AND HALLUCINATIONS**

Strict compliance is mandatory. Every claim must be project-specific, evidence-backed, trace-linked, reviewer-challenged, and free of unsupported invention. If evidence is missing, mark it as an assumption, risk, open question, or failure.


# DF Artifact Factory

## Purpose

Produce a living project book of knowledge, not document filler. Every artifact must be project-specific, standards-mapped, traceable, reviewed, and maintainable by a future human owner.

## Workflow

1. Identify artifact type, lifecycle stage, control graph node, and work-ledger item.
2. Read `references/artifact-catalog.md` for required content and reviewers.
3. For catalog artifacts, require an artifact-specific critic panel from `df-quality-refinery/references/artifact-critic-panel-matrix.md`; the old reviewer list is only the starting hint, not the final panel.
4. Read `references/artifact-tailoring.md` when project size, risk, or methodology changes the artifact set.
5. Create or update the artifact using the relevant comprehensive template in `assets/artifact-template-library/`; use `assets/templates/` only for low-level record fragments.
6. Add trace links to source requirements, customer answers, decisions, risks, code, tests, operations artifacts, control graph nodes, work-ledger items, and refinery gates.
7. If the artifact claims implementation, test, UI, scenario, release, or operation completeness, create the relevant execution evidence record: `implementation-execution-record.json`, `scenario-test-matrix.json`, or `wysiwyg-browser-test-record.json`.
8. Send the artifact to `df-quality-refinery` and `df-traceability-evidence`, including a required Artifact Review Panel Record and Artifact RALPH Loop Record.
9. If accepted, update the project book index, work ledger, control graph state, and handoff package.

## Artifact Quality Rules

- Prefer compact, dense, operationally useful artifacts over long generic documents.
- Include alternatives and rationale for design artifacts.
- Include exact owners and procedures for production artifacts.
- Include acceptance criteria and verification hooks for requirements artifacts.
- Include implementation and executable verification evidence for code/product/app artifacts; do not let documents substitute for code and tests unless the declared mode is artifact-only or planning-only.
- Include browser/WYSIWYG evidence for UI artifacts and scenario/holdout/transfer evidence for scenario-driven artifacts.
- Preserve open questions, assumptions, deferred items, and residual risks.
- Treat every governed artifact as requiring a specialist 3-critic review panel: content authority, governance/trace, and verification/handoff.
- Treat every governed artifact as requiring at least 2 adversarial critics and at least 5 RALPH loops before acceptance.
- Add risk-based specialist critics when artifact risk exceeds the default three-person panel.
- Do not optimize artifact generation for token minimization. Token use must be transparent and approved, but artifact quality, evidence, and assurance gates are the optimization goal.

## Required Project Book Sections

- Product and business context.
- Attractor Run Record or waiver for governed work.
- Control graph and active node state.
- Work ledger with owner, status, evidence, and next action.
- Requirements and acceptance scenarios.
- Recursive spec decomposition, branch interview evidence, and completeness validation.
- Architecture and decisions.
- Domain model and glossary.
- Implementation and configuration notes.
- Verification evidence.
- Implementation execution evidence.
- Scenario, holdout, transfer, browser/WYSIWYG, and visual testing evidence where applicable.
- Refinery gate records and quality certificates.
- Release and operations state.
- Risks, assumptions, and human decisions.
- Retrospective learning and feedback incorporation records.

## Resources

- `references/artifact-catalog.md`
- `references/artifact-tailoring.md`
- `assets/artifact-template-library/README.md`
- `assets/artifact-template-library/index.json`
- `assets/templates/artifact-record.json`
- `assets/templates/decision-record.json`
- `assets/templates/quality-certificate.json`
- `assets/templates/implementation-execution-record.json`
- `assets/templates/scenario-test-matrix.json`
- `assets/templates/wysiwyg-browser-test-record.json`
- `scripts/validate_artifact_catalog_ids.py`

