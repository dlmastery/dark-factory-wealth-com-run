# Dark Factory · Wealth.com Run · Checkpoint Snapshot

> A meta-meta governed software-factory skill system, applied to a regulated AI-fintech reference workload.
> Snapshot taken **2026-04-26** at the close of Stage-0 (post-checkpoint-#1 client approval).

---

## What this repository is

This repo is a **single-snapshot checkpoint** of two things:

1. **The Dark Factory Skill System** — 14 interlocking skill bundles that turn raw user intent into a governed, evidenced, standards-conformant SDLC run. The system is designed around a "zero AI slop" doctrine: every claim must be project-specific, evidence-backed, trace-linked, reviewer-challenged, and free of unsupported invention.

2. **A live run of the system on a serious workload — building a wealth.com clone (working title "EstateCompass") from a 549KB Grok-authored PRD.** The run produced 18 governance artifacts in Stage-0, caught two real subagent failures (a slop hallucination and a stall) before any downstream pollution, surfaced a material domain finding (TCJA sunset was repealed by OBBBA — the PRD models a law that no longer applies), and reached client checkpoint approval with a CONDITIONAL_PASS Hawkeye conformance audit.

Stage-0 is complete. Stage-1 (recursive intake decomposition) is unblocked. Stages 2-7 + transfer-test + retrospective are queued in the PERT plan.

---

## Why this exists

The thesis: most LLM-driven software work is undisciplined. It produces plausible-looking artifacts that drift away from real requirements, hallucinate citations, skip stages, present templates as proof, and call it "done" when the code merely compiles. For low-stakes work this is fine. For regulated work — healthcare, fintech, legal — it's malpractice waiting to happen.

The Dark Factory system flips that posture. It assumes:
- **Templates are not proof.** Every record gets a `template_marker` flag; production records must be `template_marker: false` AND contain project-specific content.
- **Independence is non-negotiable for review.** The Hawkeye Conformance Auditor must be a separate persona (separate subagent dispatch with no chat-context handoff) from the agent that authored the audited content.
- **Adversarial review is mandatory.** Every governed artifact gets at least 2 adversarial critics whose mandate is to *prove* the work is broken. They must explicitly stand down (with evidence) before acceptance.
- **Five-loop RALPH discipline.** Review → Attack → Learn → Patch → Harden, minimum 5 cycles per governed artifact. Token savings are not a valid reason to skip loops.
- **No documents-only completion.** Code-producing surfaces require implementation + tests; UI surfaces require browser/WYSIWYG evidence; scenario-driven work requires holdout + transfer tests; production work requires release + rollback + observability + outage drill.
- **Citation grounding for atomization.** When a transcript or PRD is converted to atomic facts, every atom must include a verbatim source excerpt with line numbers that can be grep-verified.

This repo demonstrates what those rules look like in practice on a real workload.

---

## Repository layout

```
.
├── README.md                                  ← this file
├── .gitignore
├── wealth_com_PRD_transcript.md               ← 549KB Grok-authored PRD (5,687 lines, 26 sections)
├── wealth_com_PRD_artifacts.md                ← 21KB live-capture of wealth.com surfaces (homepage, products, awards, integrations, leadership)
├── youtube_wealth_videos.md                   ← 18KB inventory of @wearewealth YouTube content
│
├── dark-factory-orchestrator/                 ← post-attractor lifecycle conductor
│   ├── SKILL.md                               (skill frontmatter + operating rules)
│   ├── references/                            (routing.md, lifecycle-map.md, standards-baseline.md)
│   ├── assets/templates/
│   ├── scripts/
│   └── agents/
│
├── df-meta-attractor/                         ← meta-meta entry point
├── df-governance-mayor/                       ← process constitution; gates, RASCI, change control
├── df-intake-spec-lab/                        ← recursive spec decomposition; interrogation
├── df-brownfield-recon/                       ← existing-repo discovery (NOT used in this greenfield run)
├── df-artifact-factory/                       ← BRD/SRS/HLD/LLD/ADR/runbook authoring (63-artifact catalog)
├── df-methodology-blender/                    ← RUP+MDA+DDD+TDD+SRE+SSDF blend
├── df-swarm-coordination/                     ← 3-expert debate + AI judge/jury per state transition
├── df-quality-refinery/                       ← RALPH 5-loop + rubrics + adversarial critics + certificates
├── df-traceability-evidence/                  ← knowledge graph + 35 typed link classes + validators
├── df-context-memory/                         ← compact context packs; resume safety
├── df-human-agent-handoff/                    ← bidirectional handoff; taste gates
├── df-production-sre-handoff/                 ← release readiness; outage drill; operator signoff
├── df-feedback-learning/                      ← lessons → skill-system updates
│
└── runs/
    └── wealth-com/                            ← THE RUN
        ├── README.md                          ← run-specific README
        ├── TASKS.md                           ← 23-bead ledger (active/queued/blocked/accepted/deferred)
        ├── 00_recon/
        │   ├── skill-system-survey.md         (16KB authored from primary reads)
        │   ├── prd-atoms.json                 (212 cited atoms, 100% slab coverage)
        │   ├── prd-canonical.md               (distilled markdown; cites atom IDs)
        │   └── prd-extraction-report.json     (self-grep verification: 20/20 PASS)
        ├── 01_domain/
        │   ├── domain-brief.md                (827 lines, 165 citations, 10 sections)
        │   └── critical-findings-summary.md   (6 findings; FACT-OBBBA-001 is P0)
        ├── 02_attractor/                      (Stage-0 governance pack)
        │   ├── meta-attractor-record.json     (ATTR-WEALTHCOM-001; attractor_state=stable)
        │   ├── product-tailoring-profile.json (regulated-fintech-AI-SaaS archetype)
        │   ├── generated-meta-skill-contract.json (13 project-specific refusal rules)
        │   ├── sdlc-stage-coverage-matrix.json  (17 stages × surface flags)
        │   ├── tpm-flow-ledger.json           (14-step critical path)
        │   ├── factory-pert-plan.json         (23 nodes, 30 edges, no cycles)
        │   ├── ai-judge-jury-policy.json      (7 elite persona contracts)
        │   ├── execution-kernel-state.json
        │   ├── next-action-report.json
        │   ├── dark-factory-instantiation-record.json
        │   └── checkpoint-1-approval-record.json (client approval recorded)
        ├── 03_governance/
        │   └── engagement-governance-record.json (ENG-GOV-WEALTHCOM-001 — APPROVED 2026-04-26)
        ├── 04_intake/                         (empty — Stage-1 work begins next)
        ├── 05_artifacts/                      (empty — Stage-3+ outputs land here)
        ├── 06_methodology/                    (empty)
        ├── 07_swarm/                          (empty)
        ├── 08_refinery/                       (empty)
        ├── 09_traceability/
        │   └── knowledge-graph-seed.json      (KG-WEALTHCOM-001; 30 nodes, 24 edges)
        ├── 10_production/                     (deferred — production_surface=false at v0)
        ├── 11_feedback/
        │   └── incident-INC-001-prd-agent-slop.json
        ├── 12_hawkeye/
        │   ├── hawkeye-stage0.json                       (orchestrator self pre-audit)
        │   ├── hawkeye-stage0-independent.json           (binding independent audit; CONDITIONAL_PASS)
        │   └── hawkeye-stage0-patch-bead.json            (F-001/F-009 patches + F-002 closure)
        └── app/                               (empty — code lands here at Stage-6 Construction)
```

---

## The 14 skill bundles in 14 sentences

| # | Bundle | One-liner |
|---|---|---|
| 1 | `dark-factory-orchestrator` | Lifecycle conductor that loads only the child skill needed for the current node and enforces gates between stages. |
| 2 | `df-meta-attractor` | Meta-meta entry point that converts raw, ambiguous intent into a stable governed factory run with attractor state, layer map, gates, evidence model, and routing. |
| 3 | `df-governance-mayor` | Process constitution: standards baseline, RASCI, gate policy, engagement governance, change control, threshold reductions, validators. |
| 4 | `df-intake-spec-lab` | Converts blurry intent to recursively decomposed spec leaves (vision → capability → journey → feature → rule → NFR → acceptance test) with answer-ID traceability. |
| 5 | `df-brownfield-recon` | Existing-repo discovery, change-impact analysis, regression planning. (Not used in this greenfield run.) |
| 6 | `df-artifact-factory` | Authors the 63-artifact catalog (GOV/REQ/ARC/MDA/DDD/IMP/VNV/REL/EVD) with per-artifact rubrics and execution evidence. |
| 7 | `df-methodology-blender` | Composes RUP+MDA+DDD+TDD+BDD+SRE+SSDF+OWASP-SAMM into a tailoring matrix that maps each method to concrete artifacts, gates, reviewers, and evidence. |
| 8 | `df-swarm-coordination` | Elite expert personas (TPM Judge, Evidence Clerk, Standards Juror, Domain Juror, Verification Juror, Adversarial Prosecutor, Foreperson); 3-expert debate; AI judge/jury per state transition. |
| 9 | `df-quality-refinery` | RALPH 5-loop discipline (Review-Attack-Learn-Patch-Harden) with 18 artifact-level checks + 15 per critic-seat checks + ≥2 adversarial critics + Hawkeye veto. |
| 10 | `df-traceability-evidence` | Knowledge graph with 26 node types and 35 typed link classes; validators reject orphan material nodes, accepted beads without evidence, and template-as-proof. |
| 11 | `df-context-memory` | Compact context packs for multi-day resumption; TASKS.md as authoritative resume surface; never resume from chat memory. |
| 12 | `df-human-agent-handoff` | Bidirectional handoff with taste gates, async review, confidence framing, disagreement escalation. |
| 13 | `df-production-sre-handoff` | Release readiness, runbooks, observability, outage drill, operator signoff. (Deferred for this v0 — production_surface=false.) |
| 14 | `df-feedback-learning` | Turns reviews/incidents/lessons into updates to scenarios, rubrics, templates, standards, governance — closing the loop on the system itself. |

Each bundle has a `SKILL.md` with frontmatter (name + description that controls when the orchestrator loads it), a `references/` folder of protocol docs, `assets/templates/` of JSON/YAML schemas, `scripts/` of Python validators, and `agents/openai.yaml` for cross-platform compatibility.

---

## The Wealth.com Run — what happened

### Setup (2026-04-25)
User instruction: *"read thru the meta skills and skills - then read thru the wealth_com\* prd and you will now do a multi day dark factory run to implement the prd rigorously in dark factory following everything in there without missing. absolute confirmance needed."*

The PRD was a 549KB Grok-authored speculative spec covering wealth.com's surfaces (Ester AI, Document Creation, Scenario Builder, Tax Planning, Family Office Suite, EstateFlow, Heritage Map, Ownership Balance Sheet, Estate Tax Projections, Report Builder, Integrations Hub) with 26 numbered sections.

### Stage-0 work performed
1. **Skill-system reconnaissance** — read every SKILL.md + references + templates. Authored `runs/wealth-com/00_recon/skill-system-survey.md`.
2. **Meta-attractor pack** — authored 12 governance records: Attractor Run Record (with 3-round expert debate), Product Tailoring Profile (regulated-fintech-AI-SaaS-multi-tenant archetype), Generated Meta-Skill Contract (13 project-specific refusal rules), SDLC Stage Coverage Matrix (17 stages × surface flags), TPM Flow Ledger (14 critical-path steps), PERT Plan (23 nodes, 30 edges, no cycles), AI Judge/Jury Policy (7 elite persona contracts), Execution Kernel State, Next Action Report, Dark Factory Instantiation Record, Knowledge Graph Seed (30 nodes, 24 edges), Engagement Governance Record (DRAFT pending checkpoint).
3. **PRD atomization** — extracted 212 cited atoms with verbatim source excerpts and line numbers.
4. **Domain research** — built an 827-line, 165-citation domain brief covering 2025-2026 estate tax landscape, trust strategies (GRAT/SLAT/ILIT/CLAT/Dynasty/IDGT/QPRT/CRT), IRS forms, advisor regulatory environment, competitor landscape, AI extraction patterns, security/compliance baselines.
5. **Hawkeye-Stage0 conformance audit** — independent persona; CONDITIONAL_PASS verdict (0 P0, 1 P1, 6 P2, 3 P3); 12/12 conformance axes pass; 7/7 adversarial tests pass.
6. **Checkpoint-#1 client approval** — 9 human decisions (HD-001 through HD-009) presented with default proposals; client approved all defaults 2026-04-26.

### Notable events during the run

#### INC-001: PRD-extraction subagent slop (caught + corrected)
The first PRD-atomization subagent was dispatched as type `Explore` (read-only) and could not write files. It returned a synthesis-in-message that contained fabricated specifics:
- Wrong investors (Bessemer/OpenAI Ventures/Homebrew/Point72 — none of these appear in the PRD)
- Inflated document count (1.2M, while the PRD says 50k+/100k/800k+ in different sections)
- Wrong dollar amount ($66M, while the actual Series B is $65M)
- Conflated PRD-prescribed model architectures with verified wealth.com truth without confidence tagging

**Root cause:** Explore agents are read-only by design (intended for research) but the task required file authoring; loose extraction prompts allowed confabulation; the 549KB PRD likely exceeded the agent's effective context window.

**Mitigation:** Quarantined the output before any downstream consumer used it. Wrote the incident record at `runs/wealth-com/11_feedback/incident-INC-001-prd-agent-slop.json` with disproof citations. Re-dispatched as `general-purpose` type with strict provenance protocol (every atom requires `line_start`, `line_end`, and a verbatim `source_excerpt` that is grep-verifiable; agent runs a final self-grep on 10+ random samples).

**Result:** The new agent produced 212 atoms, 100% slab coverage, 20/20 self-grep verified. The Hawkeye independent audit later cross-checked 3 random atoms against the PRD — all passed.

This is the dark factory's anti-slop discipline working in real time.

#### INC-002: Domain-research subagent stall
The first domain-research agent stalled at the synthesis-to-write transition (no progress for 600s). Re-dispatched with a per-section incremental write protocol (write each section to disk immediately after researching it, rather than batching at the end). The new agent successfully produced the domain brief with 165 citations across 10 sections.

#### Hawkeye F-001/F-009/F-002 patches
The independent Hawkeye audit found:
- **F-001 (P2):** A stale placeholder `TB-WC-2026-XXXX` in `product-tailoring-profile.json:142` that should have been `TB-WC-2026-0508-021` — the actual transfer-test bead ID. Fixed.
- **F-009 (P3):** The INC-001 disproof phrasing was overstated — the strings "Llama-3.1-70B" and "1.2 million" do appear in the PRD, just as PRD-prescribed framings rather than wealth.com truth. The first agent's actual error was conflating "PRD says X" with "wealth.com is X" without confidence tagging. Phrasing tightened.
- **F-002 (P1):** Domain brief was missing at the time of audit. Closed when the re-dispatched domain agent completed.

All recorded in `runs/wealth-com/12_hawkeye/hawkeye-stage0-patch-bead.json`.

#### FACT-OBBBA-001: a P0 scope-impact finding from domain research
The PRD heavily models a "2026 TCJA sunset to ~$7M" tax-planning use case (Scenario Builder rush-before-sunset framing, urgent SLAT/GRAT funding). Domain research discovered that the **One Big Beautiful Bill Act (OBBBA), signed July 4, 2025, permanently raised the federal estate/gift/GST exemption to $15M (2026)**. The TCJA sunset that was scheduled for 12/31/2025 did not happen — the law was modified before it triggered.

This means a faithful PRD-driven clone would ship software modeling repealed law. The PRD is itself slop on this point (or, more charitably, was written before OBBBA's effects propagated through estate-planning marketing copy).

The finding is recorded in `runs/wealth-com/01_domain/critical-findings-summary.md` as FINDING #1 (P0). At checkpoint-#1, HD-001 was amended to ask the client which framing to model. Client approved building to actual current OBBBA law — original ASM-003 invalidated and superseded by FACT-OBBBA-001 in the meta-attractor record.

This is what domain-research stages are for.

---

## Current state at this checkpoint (2026-04-26)

| Item | Status |
|---|---|
| Attractor state | **stable** |
| Engagement governance | **APPROVED** at checkpoint-#1 |
| Token budget approved band | low 150K · mid 400K · high 1.2M (~90K consumed in Stage-0) |
| PRD atomization | **complete** (212 cited atoms; 20/20 self-grep verified) |
| Domain brief | **complete** (827 lines, 165 citations, 10 sections, 6 critical findings) |
| Hawkeye-Stage0 verdict | **CONDITIONAL_PASS** by independent persona (12/12 axes, 7/7 adversarial tests) |
| Patches required by audit | **all addressed** (F-001/F-009 fixed, F-002 closed, F-006 deferred-to-Stage-5, F-011 closed-by-procedure) |
| Stage-1 (intake interrogation + recursive spec decomposition) | **unblocked** as of 2026-04-26 |
| Stages 2-7 + transfer-test + retro | queued in PERT, blocked downstream |
| Production surface | deferred (HD-004 v0 = local Docker Compose only) |

Next concrete bead: **TB-WC-2026-0426-005** — Stage-1 intake interrogation kickoff.

---

## How to read this repo

**For a quick orientation:** start at `runs/wealth-com/02_attractor/meta-attractor-record.json` (~40KB). It's the single most context-loaded record — goal, scope, mode, expert debate, gates, human decisions, assumptions, risks, evidence commitments, anti-overfit checks, next safe action, verdict.

**For the routing logic:** read `runs/wealth-com/00_recon/skill-system-survey.md` — it's a directory of every bundle's purpose, references, templates, validators, and gates. Self-contained.

**For "what does the PRD actually say":** read `runs/wealth-com/00_recon/prd-canonical.md` — citation-grounded distillation pointing back to specific atoms in `prd-atoms.json`.

**For the domain context:** read `runs/wealth-com/01_domain/domain-brief.md` — 165 citations, 10 sections, ends each section with a `GAPS:` subsection naming what's still unverified.

**For the critical findings that change project context:** read `runs/wealth-com/01_domain/critical-findings-summary.md` — 6 findings ranked by severity.

**For the operating ledger:** read `runs/wealth-com/TASKS.md` — bead-by-bead state; this is the authoritative answer to "what's next." Chat memory is *not* authoritative.

**For the audit story:** read both Hawkeye records in `runs/wealth-com/12_hawkeye/` — the orchestrator's self pre-audit (intentionally non-binding) followed by the binding independent audit (CONDITIONAL_PASS) and the patch bead that closes the audit loop.

**For the slop incidents and lessons:** read `runs/wealth-com/11_feedback/incident-INC-001-prd-agent-slop.json` — diagnostic of how an Explore agent fabricated specifics, the disproof, the corrective action, and lesson L-001.

---

## How to resume from this checkpoint

The dark factory mandates that resume happens from artifacts, not chat memory. To pick up:

1. Load `TASKS.md` — find the active bead (currently `TB-WC-2026-0426-005`).
2. Load `runs/wealth-com/02_attractor/execution-kernel-state.json` — read the `legal_next_action`.
3. Load `runs/wealth-com/02_attractor/next-action-report.json` — the kernel's last computed legal next action.
4. Load `runs/wealth-com/02_attractor/tpm-flow-ledger.json` and `factory-pert-plan.json` — what step is current, what step is next, what's blocking.
5. Load `runs/wealth-com/12_hawkeye/hawkeye-stage0-independent.json` — verify Hawkeye state hasn't been invalidated by intervening changes.
6. Load only the child skill needed for the current step (per `df-meta-attractor/references/skill-routing-map.md`).

Per `df-context-memory` rules: "Do not resume governed work from a summary unless control graph, work ledger, and trace state are visible."

---

## Source materials in this snapshot

The three files at the root are inputs the user authored *before* this run started:

- `wealth_com_PRD_transcript.md` — 549KB / 5,687 lines. A Grok deep-research output from `grok.com/c/6e7ed215-61f4-4ba4-b695-30b043eea2e6`, dated 2026-04-25T22:02:40.808Z. 26 numbered sections. Treated as primary source for PRD atomization, with the explicit caveat that Grok-authored speculative specs may contain fabricated specifics (e.g., fictional persona names, prescribed model architectures that may not match wealth.com's actual stack, the now-repealed TCJA-sunset framing).
- `wealth_com_PRD_artifacts.md` — 21KB. Live-capture catalog of wealth.com's surfaces, products, awards, integrations, leadership, press timeline, Series B details, YouTube channel, branding inventory.
- `youtube_wealth_videos.md` — 18KB. Inventory of @wearewealth YouTube content (Season 2 episodes, Practical Planner Podcast, third-party demos).

These are user inputs and have not been modified by this run.

---

## What's NOT in this snapshot

- **No code yet.** Stage-6 (Construction) hasn't started. The 9 vertical slices (Auth+Tenant, Households, Documents, Ester extractor, Estate model + Tax baseline calc, Scenario Builder, Reports, Integrations Hub, UI surfaces) are queued in the PERT plan but blocked on Stages 2-5 (Feasibility → Inception Charter → Architecture → Detailed Planning).
- **No production deployment.** Per HD-004, v0 is local Docker Compose only. Production stages are deferred (waivers WAIVER-001 + WAIVER-002 in force, expiry trigger = "production_surface enabled at a future checkpoint").
- **No formal SOC 2 audit, no third-party pen test, no legal opinion.** Out of scope per `engagement-governance-record.json §scope_baseline.out_of_scope`.
- **No real partner integrations.** 17 of 19 integration adapters are mock; 2 are real-shape contract+mock (Plaid-substitute and one Schwab-shape custody).
- **No real PII or PHI.** Synthetic data only at v0 per HD-008.
- **No use of wealth.com registered marks.** Brand substitution: working title "EstateCompass", internal AI "Sage" instead of Ester.

---

## Reproducing this run

The dark factory is designed to reproduce this kind of run on any sufficiently scoped intent. To re-run on a different workload:

1. Place the source PRD/transcript/spec in the working root.
2. Invoke `df-meta-attractor` (the meta-meta entry point). It will:
   - Read user intent.
   - Form a requirement field across all available signals.
   - Emit an Attractor Run Record (or report `attractor_state: chaotic` and ask the smallest necessary clarifying question).
   - Compile a Product Tailoring Profile with surface flags + risk profile + methodology blend.
   - Compile a Generated Meta-Skill Contract with workload-specific refusal rules.
   - Author the Stage-0 governance pack (TASKS, TPM, PERT, KG, Judge/Jury policy, SDLC matrix, kernel state, instantiation record, engagement-governance DRAFT).
   - Trigger an independent Hawkeye-Stage0 audit.
   - Halt at checkpoint-#1 for client approval.

3. Once approved, hand off to `dark-factory-orchestrator` for stage-by-stage execution.

The system is designed to be domain-agnostic — the wealth.com workload is a stress test, not a hardcoded assumption. Anti-overfit rules in this run's `product-tailoring-profile.json` and `generated-meta-skill-contract.json` keep wealth.com nouns out of factory-reusable templates.

---

## Methodology and acknowledgments

Skill-system design draws on patterns from external systems (per `df-meta-attractor/references/best-of-all-merge.md`):
- **StrongDM Attractor:** NLSpec-first implementability, graph discipline, human gates.
- **Fabro:** executable workflow graphs, model routing, checkpoints, verification, sandboxes.
- **Gas Town:** durable work state, coordinator/worker model, predecessor recovery.
- **Octopus Garden AI / Octopus Deploy:** discovery, rollout, deployment, troubleshooting lifecycle.
- **Fabriqa.ai:** PRD-to-code traceability and validation framing.

DFMS remains the standards/governance spine; external patterns contribute optional capabilities only when they map to user requirements, strengthen evidence/traceability/handoff/verification, work for both greenfield and brownfield, have a clear owner, and don't make a vendor mandatory.

Standards baseline:
- ISO/IEC/IEEE 12207:2017, 15289:2019, 42001:2023 (AI Management)
- NIST SSDF 800-218, AI RMF 1.0, CSF 2.0
- OWASP SAMM
- OMG MDA + UML 2.5.1
- CMMI V3.0 (selected practices)
- Domain-specific: GLBA, SEC Rule 204-2, FINRA Rule 17a-4 (WORM), HIPAA (PHI surfaces), CCPA/CPRA, NYDFS Part 500, WCAG 2.1 AA

---

## License

All content original to this run is provided as-is for the user's own use. The 14 dark-factory skill bundles are the user's authored skill system. The PRD transcript is a third-party Grok output included verbatim as a source artifact.

This snapshot is not redistributed software — it's a checkpoint of work-in-progress on a private workload.

---

## Next steps from this checkpoint

Per `runs/wealth-com/02_attractor/next-action-report.json`:

> **Legal next action:** Stage-1 intake interrogation. Dispatch `df-intake-spec-lab` persona on the 212 PRD atoms + 165-citation domain brief + tailoring profile + meta-attractor + critical findings summary. Produce `interrogation-record.json` and `spec-decomposition-record.json` under `runs/wealth-com/04_intake/`. Validate with `validate_spec_decomposition.py` and `validate_intake_package.py`. Then advance to Stage-2 feasibility/risk options panel.

Stage-1 work begins on the next session resume.
