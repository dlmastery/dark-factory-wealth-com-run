# ADR-003 · AI Extraction Grounding & Citation Requirements

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Decision-makers:** Architecture + AI/ML Engineer persona + Verification Juror + Adversarial Prosecutor + Domain Juror (Estate Planning Attorney)
**Supersedes:** none
**Related:** ADR-001 (deterministic-calc separation)

## Context

Slice-4 implements an Ester-substitute extractor that takes an estate document (will, trust, POA, AHCD) and produces structured facts: parties, beneficiaries, distribution rules, asset titling, GST allocations, etc. The PRD's wealth.com claim: ~500-element extraction schema across 18 categories with 95%+ accuracy target (PRD-0006, PRD-0077 per `prd-canonical.md`). Domain brief §8 surveys 2025/2026 SOTA for legal document extraction.

Forces:
- **Hallucination risk on irrevocable decisions.** A wrong beneficiary in a distribution flowchart causes inheritance disputes that can't be undone post-mortem. This is the highest-stakes hallucination scenario in the system.
- **UPL boundary (HD-007).** Extraction must support attorney review; outputs must be reviewable, not opaque "LLM said so."
- **Citation grounding is industry SOTA.** Per domain-brief.md §8, the canonical pattern is layout-aware OCR (Textract/Donut/LayoutLMv3) → LLM extraction with span-level provenance → deterministic post-processor. Wealth.com's "1,000 deterministic calculations" claim aligns.
- **Confidence is non-binary.** Some fields are unambiguous (grantor name from a will header); others are interpretive (a discretionary distribution clause). The system must distinguish.
- **Document quality varies.** OCR quality on 1990s-era handwritten codicils is poor. Confidence scoring must reflect that.

## Decision

**Every extracted fact MUST carry full provenance and confidence; the system MUST refuse silent fact-emission and MUST escalate low-confidence facts to human review.**

### Required output schema

```typescript
type ExtractedFact = {
  fact_id: string;             // ULID
  field_path: string;          // e.g., "trust.successor_trustee[0].name"
  value: string | number | null;
  provenance: {
    document_id: string;
    page: number;
    bbox?: { x: number; y: number; w: number; h: number };  // when OCR provides
    source_excerpt: string;    // verbatim snippet ≤300 chars
    excerpt_hash: string;      // sha256 to detect tampering
  };
  confidence: number;          // 0.0-1.0
  confidence_tier: "high" | "medium" | "low" | "requires_human_review";
  extraction_method: "ocr_layout" | "llm_grounded" | "rule_based" | "human";
  model_version?: string;      // when extraction_method="llm_grounded"
  ambiguity_notes?: string[];  // when interpretive
  candidate_alternatives?: { value: any; confidence: number }[];  // when ambiguous
};
```

### Confidence tiering

- `high` (≥ 0.92): auto-accept; flows into deterministic engine inputs.
- `medium` (0.70-0.92): auto-accept for non-critical fields; **require attorney review** for fields tagged `attorney_review_required: true` (parties, distribution rules, beneficiary identification, trustee succession, GST/tax elections).
- `low` (< 0.70): **NEVER auto-accepted**. Surfaces to advisor with side-by-side document view + extracted candidate + alternatives. Advisor accepts/edits/rejects. Acceptance writes to audit log.
- `requires_human_review`: extraction failed or refused. Surfaces with explanation.

### LLM prompt structure (canonical)

The extraction prompt to the LLM MUST include:
1. **System role:** "You extract structured facts from estate documents. You MUST cite a verbatim source_excerpt for each fact. You MUST refuse to emit facts you cannot ground in the document."
2. **JSON schema** (strict, with provider's structured-output enforcement: Anthropic tool-use schema, etc.)
3. **Instructions on refusal:** explicit examples of "I cannot find this fact in the document" → emit `null` with `confidence: 0.0` and `confidence_tier: "requires_human_review"`.
4. **No arithmetic:** "Do not perform calculations. Extract the raw values; calculations are performed elsewhere." (per ADR-001)
5. **Source span requirement:** every emitted fact carries a `source_excerpt` that MUST appear verbatim in the document (post-extraction validator confirms).

### Post-extraction validator

`apps/ai-extract/validators/grounding.ts` runs on every extraction:
- For each fact, grep `source_excerpt` in the document text; if not found, downgrade `confidence_tier` to `requires_human_review` and log a `grounding_failure` audit event.
- For each numeric value, confirm it's a literal in the document or `null` (no synthesis).
- For each fact tagged `attorney_review_required`, force tier to at least `medium` (no silent auto-accept on these).
- Reject any output that violates the JSON schema.

### Holdout dataset (anti-overfit per RSK-005)

The Ester extractor's evaluation set MUST come from public corpora (open law school sample wills, public court probate filings) — NOT from the wealth.com PRD examples. This prevents data leakage where the model has memorized the eval set. Evaluation metrics:
- Per-field precision/recall on the held-out set.
- "Refusal correctness": when the document doesn't contain a fact, does the system refuse rather than hallucinate?
- Calibration: when the system says `confidence: 0.85`, is the empirical accuracy at that tier ~85%?

### Transfer test

Before run closure, the extractor is run against a different document type from a different domain (e.g., a real-estate purchase agreement, NOT an estate document). Expectation: massive refusal rate (`requires_human_review`) with no hallucinated facts. Confirms the grounding gate generalizes.

## Consequences

### Positive
- **No silent hallucinations.** Every fact has source span; the validator catches ungrounded outputs.
- **Auditable.** Provenance + excerpt_hash gives a tamper-evident chain from document pixel → fact.
- **Calibrated.** Confidence tiers route to attorney review where appropriate; auto-accept is reserved for unambiguous fields.
- **UPL-safe.** Attorney review is a first-class workflow, not a footnote.

### Negative / Cost
- **Higher LLM cost per document.** Structured output + provenance + refusal-honesty = more tokens. Mitigated by prompt caching + provider's structured-output discount.
- **Attorney-review backlog risk.** If too many facts land in medium-tier, advisor productivity suffers. Mitigated by per-firm tuning of `attorney_review_required` field set.
- **Holdout dataset acquisition cost.** Sourcing public corpora takes effort. Initial budget: 50-100 documents.

### Refusal rules locked
- Refuse to deploy an extractor without the grounding validator running on every output.
- Refuse to deploy with a holdout dataset sourced from PRD examples or wealth.com material.
- Refuse to lower the medium-tier threshold below 0.70 without owner-scoped waiver.
- Refuse to silently auto-accept `attorney_review_required` fields below `high` confidence.

## Alternatives considered

### Alt-A: LLM emits raw text with no schema (rejected)
"Just have the model summarize the document." Rejected — downstream consumers (calc-engine, scenario builder) need typed inputs. Free-text loses information and audit trail.

### Alt-B: Schema with no provenance (rejected)
Output JSON facts without source spans. Rejected — no audit trail; no defense against hallucination.

### Alt-C: Provenance but no refusal rule (rejected)
LLM cites the document for every fact, but allowed to "best-guess" when it can't find the fact. Rejected — turns silent hallucination into cited hallucination, which is worse.

### Alt-D: Human-only extraction (rejected — defeats product)
Cost prohibitive, doesn't scale. The product value depends on AI extraction with strong guardrails.

### Alt-E: Citation by paragraph index, not span (rejected)
Coarser provenance. Rejected — span-level enables exact-match validation. Paragraph-level allows "the model picked a number from somewhere in this paragraph" hallucination.

## Verification

- **Schema enforcement test:** `apps/ai-extract/tests/schema.test.ts` feeds malformed model outputs; expects rejection.
- **Grounding gate test:** synthesize a model output where `source_excerpt` doesn't appear in the document; expect tier downgrade to `requires_human_review`.
- **Refusal honesty test:** feed a document missing a required field; expect graceful refusal, not hallucination.
- **Calibration test:** run extractor on holdout set; bin predictions by `confidence`; expect empirical accuracy ≈ confidence within ±5%.
- **Attorney-review-routing test:** facts tagged `attorney_review_required` at medium tier MUST surface to a queue, never auto-accept.
- **Provider-swap test:** swap LLM provider (e.g., Claude → another); expect schema enforcement + grounding to still hold (no provider-specific assumptions in the validator).
- **Hawkeye recurring check:** grep `apps/ai-extract` for any code path that emits a fact without provenance population. Any hit fails.

## Trace links

- Source: ATTR-WEALTHCOM-001 §risks RSK-001 (AI hallucination on legal documents)
- Source: PRODUCT-TAILORING-WEALTHCOM-001 §risk_profile.safety
- Source: GENERATED-META-SKILL-WEALTHCOM-001 §refusal_rules
- Source: domain-brief.md §8 (extract→compute→narrate; SOTA grounding)
- Source: ADR-001 (companion: no LLM arithmetic)
- Source: HD-007 (UPL handling — attorney review is a first-class workflow)
- Mitigates: RSK-001, RSK-003 (UPL)
- Implemented-by: `apps/ai-extract/`, `packages/contracts/extraction.json`, holdout dataset (forthcoming Slice-4)
- Verified-by: Slice-4 RALPH + holdout eval report + transfer test + recurring Hawkeye grounding-gate check
