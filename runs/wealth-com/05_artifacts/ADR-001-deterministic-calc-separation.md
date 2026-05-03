# ADR-001 · Deterministic-Calc Separation

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Decision-makers:** Architecture persona panel (Architect + AI/ML Engineer + Tax Domain Juror + Verification Juror + Adversarial Prosecutor)
**Supersedes:** none
**Superseded-by:** none

## Context

The Demo MVP includes an Ester-substitute extractor (Slice-4) and a federal-estate-tax baseline calculator under OBBBA (Slice-5). The PRD claims wealth.com performs "1,000 deterministic calculations per estate" — domain research (`runs/wealth-com/01_domain/domain-brief.md` §8 + `critical-findings-summary.md` FINDING #5) confirmed this corresponds to the canonical pattern in regulated AI: **extract → compute → narrate**.

Forces:
- **Fiduciary risk (RSK-001, RSK-002):** an LLM that hallucinates a tax calculation, beneficiary distribution, or trust mechanic causes irrevocable client harm. Tax penalties accrue at rule-driven thresholds (e.g., OBBBA $15M exemption, GST inclusion ratio, 7520 rate). Wrong number → wrong filing → IRS exposure.
- **Auditability:** SEC Rule 204-2 + FINRA Rule 17a-4 require books-and-records on advice rationale. "The model said so" is not a defensible audit trail.
- **NIST AI RMF 1.0 + ISO 42001:** require human-overseeable AI behavior with explainability, especially for high-stakes decisions.
- **PRD self-claim:** "1,000 deterministic calculations" — implies a code-driven engine, not LLM math.
- **OBBBA exemption math:** federal estate tax is straightforward arithmetic ($15M permanent + DSUE portability + bracket lookup). LLM-doing-math is gratuitous risk.

## Decision

**The system MUST separate AI extraction from deterministic computation at the architectural layer. LLMs MUST NOT perform tax/estate/legal calculations. LLMs MAY only:**
1. **Extract** structured facts from documents (parties, assets, beneficiaries, distribution rules) into a JSON Schema.
2. **Narrate** results AFTER the deterministic engine has produced them — and even then, narrative MUST cite the rule/computation IDs that produced each number.

The deterministic engine is a separate service (Python `apps/calc-engine` in this monorepo) with:
- Pure functions (input → output, no side effects) for each rule.
- Each rule has a citation: IRS code section, OBBBA reference, state regulation.
- Each rule has a golden-dataset test (`apps/calc-engine/tests/golden/`).
- Float comparisons use `Decimal` arithmetic to avoid IEEE-754 surprises in money contexts.
- Every calculation produces a trace record: `{rule_id, inputs, output, citation, computed_at, computation_version}` persisted to the WORM audit log.

The AI extraction service (`apps/ai-extract`) MUST:
- Output strict JSON conforming to `schemas/extraction.json`.
- Include per-field provenance: source document ID + page + bounding-box (when OCR allows) + confidence score.
- Refuse to emit any number without a citation OR mark it as `requires_human_review`.
- Never call the calc-engine directly — orchestration runs through the API layer.

## Consequences

### Positive
- **Audit defensibility.** Every dollar in a client report traces to a rule_id + citation + golden-test. Hawkeye can grep for "rule_id" → it must exist in the rule library.
- **Hallucination containment.** LLM hallucinations are bounded to extraction (caught by JSON Schema validation + grounding gate) and narration (caught by post-hoc citation check).
- **Testability.** Tax math has golden-dataset tests independent of model behavior. Model can change without regression on calculations.
- **Regulatory alignment.** Fits NIST AI RMF Govern/Map/Measure/Manage and ISO 42001 control objectives.
- **Refactor isolation.** Calc engine can be ported to any language; LLM provider can swap without affecting tax results.

### Negative / Cost
- **Two services.** API surface + AI service + calc service = three deployable units. Higher operational complexity.
- **Schema drift risk.** Extraction JSON schema must stay in sync with calc-engine input contract. Mitigation: shared schema in `packages/contracts/` consumed by both.
- **Slower path for "obvious" cases.** A simple "what's the federal estate tax on $25M" query goes LLM-extract → calc → narrate, not "LLM answers in one shot." Tradeoff accepted for correctness.

### Refusal rules locked into `generated-meta-skill-contract.json`
- Refuse to use LLM for tax/estate calculations without deterministic-engine fallback.
- Refuse to accept artifacts that bypass the extract→compute→narrate pattern.
- Refuse to merge code that calls the LLM provider for arithmetic.

## Alternatives considered

### Alt-A: Single LLM-only path (rejected)
"Just have the LLM compute the tax." Rejected — fails audit, fiduciary, and hallucination criteria. Industry pattern for regulated AI specifically forbids this.

### Alt-B: LLM with code-interpreter / tool-calling (rejected)
"LLM picks up a tool to do math." Rejected — the LLM still chooses *which* rule to apply and *what inputs* to feed it. Hallucination just shifts to rule-selection. Deterministic dispatch is required.

### Alt-C: Hybrid where LLM proposes the calc and a verifier double-checks (rejected for v0)
Worth considering for v2. Adds complexity without clear win for a Demo MVP.

### Alt-D: Pure rule engine with no LLM (rejected for product reason)
Defeats the wealth.com value proposition. Document extraction at scale needs LLMs. The decision is HOW to bound them, not WHETHER.

## Verification

This ADR is enforced by:
- **Code structure:** physical separation `apps/api`, `apps/ai-extract`, `apps/calc-engine`, `packages/contracts`.
- **Contract test:** `packages/contracts/tests` validates JSON Schema compliance bidirectionally.
- **Golden dataset:** `apps/calc-engine/tests/golden/` includes federal estate tax under OBBBA + DSUE portability + GST inclusion ratio (placeholder set; expanded in Slice-5).
- **Adversarial test:** Slice-4 RALPH loop includes an attack: feed a document where the LLM is tempted to "just give the number." The system must produce `requires_human_review` rather than a hallucinated value.
- **Hawkeye check (recurring):** at every stage exit, Hawkeye greps `apps/ai-extract` for arithmetic operators (`+ - * /` on monetary types) and the calc-engine import paths from the AI service. Any hit fails the audit.

## Trace links

- Source: ATTR-WEALTHCOM-001 §non_negotiable_constraints_locked_in (item #1)
- Source: PRODUCT-TAILORING-WEALTHCOM-001 §risk_profile.safety + .money + .compliance
- Source: GENERATED-META-SKILL-WEALTHCOM-001 §refusal_rules (item #1, #3)
- Source: domain-brief.md §8 (extract→compute→narrate canonical pattern)
- Source: critical-findings-summary.md FINDING #5 (FACT-EXTRACT-COMPUTE-NARRATE-001)
- Mitigates: RSK-001 (AI hallucination on legal documents), RSK-002 (Tax calculation error)
- Implemented-by: `apps/calc-engine/`, `apps/ai-extract/`, `packages/contracts/` (forthcoming Slice-4/5)
- Verified-by: Slice-4 RALPH loop record + Slice-5 golden-dataset test report + recurring Hawkeye check
