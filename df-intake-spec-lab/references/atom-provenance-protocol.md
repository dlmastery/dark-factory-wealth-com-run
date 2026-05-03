# Atom Provenance Protocol

When converting an external corpus (PRD, transcript, research dump, partner spec, regulatory text) into atomic claims for downstream consumers (intake interrogation, spec decomposition, requirements catalog, traceability matrix, code), every atom MUST satisfy this protocol. Lesson L-001 from `RUN-WEALTHCOM-001` INC-001 incident.

## Why this exists

Without strict provenance, subagents extracting atoms will confabulate plausible-sounding specifics that are NOT in the source. INC-001 (2026-04-25) caught a subagent fabricating investor names ("Bessemer Venture Partners", "OpenAI Ventures", "Homebrew", "Point72") and inflated metrics ("1.2 million documents") that did not exist in a 549KB Grok-authored PRD. The fabrications were caught by orchestrator line-grep before downstream consumers used them. Without this protocol, the slop would have flowed into requirements.

## Required atom schema

Every atom emitted by an extraction subagent MUST contain at minimum:

```json
{
  "id": "<NAMESPACE>-<NNNN>",
  "kind": "<requirement|capability|entity|workflow|rule|integration|nfr|persona|risk|ui|data|ai|security|compliance|metric|pricing|gtm|competitive|roadmap|architecture|assumption|open_question>",
  "surface": "<surface_or_topic>",
  "statement": "<concise normalized claim, ≤200 chars>",
  "source_file": "<absolute or repo-relative path>",
  "line_start": <integer>,
  "line_end": <integer>,
  "source_excerpt": "<verbatim text from the source, ≤300 chars; must be exactly grep-able>",
  "section_hint": "<section number/heading from the source if known>",
  "confidence": "<high|medium|low>",
  "open_question": null | "<single sentence>"
}
```

Rationale per field:

- `source_file` + `line_start` + `line_end`: pin the atom to a specific provenance location.
- `source_excerpt`: a verbatim slice the orchestrator can grep against the source file. Cannot be paraphrased or summarized.
- `confidence`: `high` for direct factual extraction; `medium` for source-prescribed details that may not be product truth (e.g., a Grok-authored speculative PRD prescribing model architectures wealth.com may not actually use); `low` for vague or aspirational claims.
- `open_question`: surfaces ambiguity for downstream stages rather than burying it.

## Required orchestrator workflow

1. **Dispatch subagent with strict prompt.** The extraction prompt MUST forbid any atom without verbatim `source_excerpt`. Sample text in the prompt: *"If you cannot find a verbatim excerpt for a claim, DO NOT INCLUDE IT. Better to skip than to hallucinate."*

2. **Subagent self-grep step.** The subagent's final action before reporting completion is to randomly sample N (≥10) of its own atoms and grep their `source_excerpt` against `source_file`. Failure to match → re-extract that section. Successful samples + counts written to a self-validation report.

3. **Orchestrator independent grep.** After the subagent reports completion, the orchestrator picks 5 fresh random atoms and grep-verifies them independently. If any fail, the extraction is QUARANTINED and the bead is sent to rework.

4. **Hawkeye sample audit.** Independent Hawkeye, when auditing the extraction stage, picks 3+ random atoms and grep-verifies them as part of the conformance audit. Independence rule: Hawkeye's sample MUST NOT overlap with the subagent's self-grep set.

## Required reject triggers

The following triggers MUST be wired into `df-quality-refinery` anti-slop checks:

- Atom file lacks `source_excerpt` field on any atom → reject.
- Atom file has `source_excerpt` strings that fail grep against the cited `source_file` → reject.
- Atom file references `line_start`/`line_end` outside the actual line count of `source_file` → reject.
- Subagent self-grep verification block missing or shows fewer than 10 samples or fewer than 100% pass → reject.
- Atoms that conflate "source says X about product" with "product is X" without `confidence: medium` and explicit framing (e.g., "PRD-prescribed", "speculative-source") → reject. (Lesson L-001 F-009 from Hawkeye-stage0-independent.)

## Companion validators

A companion script `validate_prd_atoms.py` is recommended at `df-intake-spec-lab/scripts/`. Behavior:

```
validate_prd_atoms.py <atoms.json> --source <source-file> [--sample N]
```

- Loads atoms.json
- For each atom: confirms presence of required fields
- For a random sample of N atoms (default 20): greps the `source_excerpt` against `source_file`
- Returns 0 on full pass; non-zero on any failure with detailed report
- Hawkeye and orchestrator both invoke this validator before accepting an atomization bead

## Trace into the orchestrator's TASKS.md

Atomization beads MUST list this protocol as a gate:

```
| Bead | Gate | Evidence |
| ... | atom-provenance-protocol pass + grep-verified ≥10 sample + orchestrator-independent-grep ≥5 sample | atoms.json + extraction-report.json + grep-confirmation logs |
```

## Origin

This protocol was derived from `RUN-WEALTHCOM-001 INC-001` (2026-04-25) and codified in lesson `L-001` from `RUN-WEALTHCOM-001 INC-001 §lesson_for_skill_system`. Hawkeye-stage0-independent verified that the corrective re-extraction (TB-WC-2026-0425-002) successfully applied this protocol: 212 atoms produced, 100% slab coverage, 20/20 self-grep verified. The protocol scales to any corpus type.
