"""Grounding validator — the heart of ADR-003.

Per ADR-003: every extracted fact MUST carry a verbatim source_excerpt that
appears in the document. This module is the post-extraction gate that
enforces that contract. An LLM that fabricates a fact silently passes
JSON-schema validation but fails grounding.

The rule:
- For each ExtractedFact, locate `provenance.source_excerpt` in the
  document text. Use a load-bearing substring (first 60 chars, or the whole
  thing if shorter) to tolerate trailing-whitespace / line-wrap differences.
- If found: keep the original tier.
- If NOT found: downgrade tier to 'requires_human_review' and add to
  validation_failures with a grounding_failure reason.
- For each fact tagged attorney_review_required: force tier to at least
  'medium' (no silent auto-accept on these).
- Compute the excerpt_hash and verify it matches what the extractor
  emitted (tamper detection per ADR-003).

This file is pure (no I/O, no network). Caller passes document_text + facts;
gets back validated facts + a report.

Tested by tests/test_grounding_validator.py (unit, no LLM required).
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from typing import Any

GROUND_NEEDLE_LEN = 60  # load-bearing substring length (matches L-001 validator)


@dataclass
class GroundingValidationFailure:
    fact_id: str
    field_path: str
    reason: str
    severity: str  # 'downgrade_tier' | 'reject_fact' | 'tamper_detected'


@dataclass
class GroundingValidationResult:
    facts: list[dict[str, Any]]  # validated facts (tiers possibly downgraded)
    failures: list[GroundingValidationFailure] = field(default_factory=list)

    @property
    def is_clean(self) -> bool:
        """True if no validation failures."""
        return len(self.failures) == 0

    @property
    def downgrade_count(self) -> int:
        return sum(1 for f in self.failures if f.severity == "downgrade_tier")


def validate_grounding(
    document_text: str,
    facts: list[dict[str, Any]],
) -> GroundingValidationResult:
    """Run the grounding gate on a list of ExtractedFact dicts.

    Mutates each fact's 'confidence_tier' as needed; appends to validation_failures
    on the result.
    """
    result = GroundingValidationResult(facts=[])

    for fact in facts:
        validated = dict(fact)  # shallow copy; mutate the new one

        provenance = validated.get("provenance") or {}
        excerpt = (provenance.get("source_excerpt") or "").strip()
        emitted_hash = provenance.get("excerpt_hash", "")
        fact_id = validated.get("fact_id", "<no-id>")
        field_path = validated.get("field_path", "<no-path>")

        if not excerpt:
            result.failures.append(
                GroundingValidationFailure(
                    fact_id=fact_id,
                    field_path=field_path,
                    reason="empty source_excerpt",
                    severity="downgrade_tier",
                )
            )
            validated["confidence_tier"] = "requires_human_review"
        else:
            # Tamper check: emitted hash matches recomputed hash.
            recomputed = hashlib.sha256(excerpt.encode("utf-8")).hexdigest()
            if emitted_hash and emitted_hash != recomputed:
                result.failures.append(
                    GroundingValidationFailure(
                        fact_id=fact_id,
                        field_path=field_path,
                        reason=f"excerpt_hash mismatch: emitted={emitted_hash[:12]} recomputed={recomputed[:12]}",
                        severity="tamper_detected",
                    )
                )
                validated["confidence_tier"] = "requires_human_review"
            else:
                # Always populate hash if missing (defensive; producers should set it).
                provenance["excerpt_hash"] = recomputed
                validated["provenance"] = provenance

                # Grounding check: load-bearing substring must appear in document.
                needle = excerpt if len(excerpt) <= GROUND_NEEDLE_LEN else excerpt[:GROUND_NEEDLE_LEN]
                if needle not in document_text:
                    result.failures.append(
                        GroundingValidationFailure(
                            fact_id=fact_id,
                            field_path=field_path,
                            reason=f"source_excerpt not found in document (needle len {len(needle)})",
                            severity="downgrade_tier",
                        )
                    )
                    validated["confidence_tier"] = "requires_human_review"

        # Attorney-review-required floor: force tier to at least 'medium'.
        if validated.get("attorney_review_required") and validated.get("confidence_tier") == "low":
            validated["confidence_tier"] = "medium"

        result.facts.append(validated)

    return result


def compute_excerpt_hash(excerpt: str) -> str:
    """Producer-side helper: emit excerpt_hash for an ExtractedFact's provenance."""
    return hashlib.sha256(excerpt.encode("utf-8")).hexdigest()
