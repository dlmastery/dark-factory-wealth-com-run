---
name: df-methodology-blender
description: Methodology blending for RUP, MDA, DDD, TDD, BDD, Agile, SRE, ISO lifecycle processes, SSDF, OWASP SAMM, and company delivery playbooks. Use when a project needs multiple methods composed into one coherent workflow with artifacts, gates, roles, and verification.
---

## Zero-Slop Compliance

**NO AI SLOP ALLOWED AT ALL - ZERO TOLERANCE TO SLOP AND HALLUCINATIONS**

Strict compliance is mandatory. Every claim must be project-specific, evidence-backed, trace-linked, reviewer-challenged, and free of unsupported invention. If evidence is missing, mark it as an assumption, risk, open question, or failure.


# DF Methodology Blender

## Purpose

Compose methodologies without ceremony theater. Convert each method into concrete artifacts, checks, loops, and gates.

## Workflow

1. Create a Methodology Blend Record using `assets/templates/methodology-blend-record.json`.
2. Identify which methods are required by domain, risk, user request, company policy, and standards tailoring.
3. Load or create the Product Tailoring Profile and use product archetype, surfaces, lifecycle mode, and risk profile to select the method blend.
4. Compile each included method into control graph nodes, work-ledger items, required artifacts, reviewers, gates, and evidence.
5. Map RUP phases to lifecycle stages when phase discipline is needed.
6. Map MDA CIM/PIM/PSM when business, platform-independent, and platform-specific separation matters, including transformation records and exception handling.
7. Apply DDD for domain language, bounded contexts, aggregates, invariants, events, and anti-corruption layers.
8. Apply TDD/BDD for executable acceptance, red-green-refactor evidence, holdout scenarios, and regression evidence.
9. Apply SRE for production ownership, SLIs/SLOs, runbooks, incident paths, outage drills, and rollback.
10. Create or update the SDLC Stage Coverage Matrix and scenario test matrix so every selected method maps to implementation, test, browser/WYSIWYG, release, operations, and maintenance gates where applicable.
11. For UI or WYSIWYG work, add Playwright/browser verification obligations: desktop/mobile screenshots, interactions, console/network errors, non-overlap, text fit, responsiveness, accessibility where applicable, and visual regression where risk requires it.
12. Create or update the Generated Meta-Skill Contract when methodology tailoring is part of a meta-meta run.
13. Resolve conflicts through expert debate and decision records.
14. Send the blend record to `df-quality-refinery` and `df-traceability-evidence`.

## Output

Produce a methodology tailoring matrix that says:

- Method included or excluded.
- Why it applies.
- Which artifacts it requires.
- Which gates it adds.
- Which reviewers enforce it.
- How evidence is produced.
- Which control graph nodes and work-ledger items enforce it.
- Which refinery gates prove it.
- Which method-specific transformation or test evidence is mandatory.
- Which SDLC stages are required, waived, deferred, or not applicable.
- Which testing classes are mandatory for the declared project surfaces.
- Whether the work is artifact-only/planning-only or whether implementation and executable verification are required.
- How the product-tailored method blend changes the generated meta-skill behavior, gates, refusal rules, and required evidence.

## Resources

- `references/rup-mda-ddd-tdd.md`
- `assets/templates/methodology-blend-record.json`
- `assets/templates/product-tailoring-profile.json`
- `assets/templates/generated-meta-skill-contract.json`
- `assets/templates/sdlc-stage-coverage-matrix.json`
- `assets/templates/scenario-test-matrix.json`
