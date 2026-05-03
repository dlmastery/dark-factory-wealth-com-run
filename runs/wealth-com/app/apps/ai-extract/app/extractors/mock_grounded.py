"""MockGroundedExtractor — testable extractor that uses the same contract as
the Claude-backed one but doesn't require an API key.

Implements: a few simple regex-based extractions over a sample trust document
shape. Used in unit tests + the demo flow when ANTHROPIC_API_KEY is not set.

Real extractor (extractors/claude_grounded.py) is forthcoming and will:
- Call Anthropic Claude with structured-output schema (tool-use mode).
- Apply the same grounding validator on output.
- Drop facts that the model refuses to ground (refusal-honesty per ADR-003).
"""

from __future__ import annotations

import re
import uuid
from datetime import datetime, timezone
from typing import Any

from app.validators.grounding import compute_excerpt_hash


class MockGroundedExtractor:
    model_version: str = "mock-grounded-0.1.0"

    def extract(
        self,
        document_text: str,
        document_id: str,
        tenant_id: str,
        requested_field_paths: list[str] | None = None,
    ) -> dict[str, Any]:
        facts: list[dict[str, Any]] = []
        refusals: list[dict[str, Any]] = []

        # Initial Trustee
        m = re.search(r"initial Trustee shall be ([A-Z][a-zA-Z\.\- ]+?(?:[A-Z][a-z]+))", document_text)
        if m:
            excerpt = m.group(0).strip().rstrip(".")
            # Get a wider context excerpt for grounding (the full sentence).
            sent_match = re.search(rf"[^.]*{re.escape(m.group(0))}[^.]*\.", document_text)
            full_excerpt = (sent_match.group(0) if sent_match else excerpt).strip()
            facts.append(self._mk_fact(
                field_path="trust.initial_trustee.name",
                value=m.group(1).strip(),
                excerpt=full_excerpt,
                document_id=document_id,
                attorney_review_required=True,
                confidence=0.95,
            ))
        else:
            refusals.append({"field_path": "trust.initial_trustee.name", "reason": "not found in document"})

        # Successor Trustee
        m = re.search(r"Successor Trustee shall be ([A-Z][a-zA-Z\.\- ]+?(?:Jr\.|Sr\.|[A-Z][a-z]+))", document_text)
        if m:
            sent_match = re.search(rf"[^.]*{re.escape(m.group(0))}[^.]*\.", document_text)
            full_excerpt = (sent_match.group(0) if sent_match else m.group(0)).strip()
            facts.append(self._mk_fact(
                field_path="trust.successor_trustee.name",
                value=m.group(1).strip(),
                excerpt=full_excerpt,
                document_id=document_id,
                attorney_review_required=True,
                confidence=0.92,
            ))
        else:
            refusals.append({"field_path": "trust.successor_trustee.name", "reason": "not found"})

        # Distribution percentages — pull a chunky verbatim slice
        m = re.search(
            r"fifty percent.*?children's[^.]*",
            document_text,
            re.IGNORECASE | re.DOTALL,
        )
        if m:
            facts.append(self._mk_fact(
                field_path="trust.distribution_rule",
                value=m.group(0).strip(),
                excerpt=m.group(0).strip(),
                document_id=document_id,
                attorney_review_required=True,
                confidence=0.88,
            ))

        return {
            "document_id": document_id,
            "tenant_id": tenant_id,
            "extracted_at": datetime.now(timezone.utc).isoformat(),
            "model_version": self.model_version,
            "facts": facts,
            "refusals": refusals,
        }

    @staticmethod
    def _mk_fact(
        *,
        field_path: str,
        value: Any,
        excerpt: str,
        document_id: str,
        attorney_review_required: bool,
        confidence: float,
    ) -> dict[str, Any]:
        # Tier from confidence per ADR-003
        if confidence >= 0.92:
            tier = "high"
        elif confidence >= 0.70:
            tier = "medium"
        else:
            tier = "low"
        return {
            "fact_id": str(uuid.uuid4()),
            "field_path": field_path,
            "value": value,
            "confidence": confidence,
            "confidence_tier": tier,
            "extraction_method": "rule_based",
            "model_version": MockGroundedExtractor.model_version,
            "attorney_review_required": attorney_review_required,
            "provenance": {
                "document_id": document_id,
                "page": 1,
                "source_excerpt": excerpt,
                "excerpt_hash": compute_excerpt_hash(excerpt),
            },
        }
