# Skill Routing Map

Use this reference before loading child dark-factory skills.

## Primary Routing

| Need | Skill |
| --- | --- |
| Full governed factory run | `dark-factory-orchestrator` |
| Raw intent to requirements | `df-intake-spec-lab` |
| Standards, stage gates, RASCI, change control | `df-governance-mayor` |
| SDLC artifacts and project book | `df-artifact-factory` |
| Triple review, rubrics, certificate | `df-quality-refinery` |
| Traceability and evidence ledger | `df-traceability-evidence` |
| Existing repo or legacy change | `df-brownfield-recon` |
| Human takeover or handback | `df-human-agent-handoff` |
| Context rot, resumes, project memory | `df-context-memory` |
| RUP, MDA, DDD, TDD, BDD, SRE blend | `df-methodology-blender` |
| Expert debate or decomposition | `df-swarm-coordination` |
| Release, operations, incident, maintenance package | `df-production-sre-handoff` |
| Lessons, review feedback, failed gates | `df-feedback-learning` |

## Meta-Meta Routing Patterns

Use `df-meta-attractor` first when:

- The user asks for the factory itself to improve.
- A request mixes product, process, governance, and benchmark goals.
- A previous artifact review reveals systemic weakness.
- The user says "meta-meta", "attractor", "factory above skills", "requirements gravity", or similar.
- The work must generalize across future projects and brownfield repos.

Then route to:

- `df-feedback-learning` when the result should update skills, templates, rubrics, or lessons.
- `dark-factory-orchestrator` when the result should start or continue a project run.
- `df-artifact-factory` when the result is a new controlling artifact.
- `df-quality-refinery` when the result needs certificate-level review.

## Minimal Loading Rule

Load only the child skill needed for the current node. Do not load every skill because the request is ambitious. The meta-attractor should compress the field, then the orchestrator should expand only the next step.

## Subagent Dispatch Rules (lesson L-001)

When a routed step is delegated to a subagent, the dispatcher MUST match agent type to task semantics:

| Task semantic | Required agent capability | Subagent type (Claude Code) |
| --- | --- | --- |
| Open-ended research / read-only exploration | Read, Glob, Grep, WebFetch, WebSearch | `Explore` (read-only) — fast, but cannot author files |
| Atomization of an external corpus into structured artifacts | Read + Write + Grep self-verification | **`general-purpose`** — Explore agents will return synthesis-in-message and stall the pipeline |
| Drafting governance records, code, tests, runbooks | Read + Write + Edit | **`general-purpose`** |
| Independent audit (Hawkeye) | Read + Write (no chat-history) | **`general-purpose`** dispatched in a separate invocation with NO chat-context handoff (independence rule) |
| Long-running incremental work (e.g., per-section research with progressive writes) | Read + Write + Edit + WebSearch | **`general-purpose`** with explicit "write per section, do not batch synthesis" instruction (mitigates INC-002 stall pattern) |

Rejection trigger (enforced by `df-quality-refinery` anti-slop rule): a bead whose acceptance evidence is "subagent reported success" but no expected output files exist on disk. Orchestrators MUST verify file existence and content before transitioning the bead.

Provenance rule for atomization tasks: every atom (PRD claim, transcript fact, requirement leaf) MUST carry `line_start`, `line_end`, and a verbatim `source_excerpt` that the orchestrator can grep-verify against the source file. Random-sample (n≥10) grep verification is mandatory before acceptance.
