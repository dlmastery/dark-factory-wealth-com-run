"""Unit tests for the grounding validator (ADR-003 enforcement)."""

from __future__ import annotations

import hashlib

from app.validators.grounding import (
    GROUND_NEEDLE_LEN,
    compute_excerpt_hash,
    validate_grounding,
)

DOCUMENT = """
ARTICLE I.  TRUSTEE
The initial Trustee shall be Jane Doe of Phoenix, Arizona.
If Jane Doe is unable or unwilling to serve, the Successor Trustee shall be
John Doe Jr., the Grantor's son.

ARTICLE II.  DISTRIBUTION
Upon the death of the Grantor, the trust property shall be distributed
fifty percent (50%) to the Grantor's spouse, twenty-five percent (25%) to
the children in equal shares per stirpes, and twenty-five percent (25%) to
the Phoenix Children's Hospital Foundation.
"""


def _fact(fact_id: str, field_path: str, value, excerpt: str, tier: str = "high",
          attorney_review_required: bool = False) -> dict:
    return {
        "fact_id": fact_id,
        "field_path": field_path,
        "value": value,
        "confidence": 0.95,
        "confidence_tier": tier,
        "attorney_review_required": attorney_review_required,
        "provenance": {
            "document_id": "00000000-0000-4000-8000-000000000001",
            "page": 1,
            "source_excerpt": excerpt,
            "excerpt_hash": compute_excerpt_hash(excerpt),
        },
    }


def test_grounded_fact_passes() -> None:
    fact = _fact("F1", "trust.initial_trustee.name", "Jane Doe",
                 "The initial Trustee shall be Jane Doe of Phoenix, Arizona.")
    result = validate_grounding(DOCUMENT, [fact])
    assert result.is_clean
    assert result.facts[0]["confidence_tier"] == "high"


def test_ungrounded_fact_downgrades_tier() -> None:
    # Fabricated excerpt — model claims this verbatim text is in the document.
    fact = _fact("F2", "trust.initial_trustee.name", "Bob Smith",
                 "The initial Trustee shall be Bob Smith of Seattle.")
    result = validate_grounding(DOCUMENT, [fact])
    assert not result.is_clean
    assert result.failures[0].severity == "downgrade_tier"
    assert result.facts[0]["confidence_tier"] == "requires_human_review"


def test_empty_excerpt_downgrades() -> None:
    fact = _fact("F3", "trust.foo", "x", "")
    # Patch hash to empty too (producer shouldn't have set one for empty excerpt).
    fact["provenance"]["excerpt_hash"] = ""
    result = validate_grounding(DOCUMENT, [fact])
    assert not result.is_clean
    assert result.facts[0]["confidence_tier"] == "requires_human_review"


def test_tamper_detection() -> None:
    fact = _fact("F4", "trust.initial_trustee.name", "Jane Doe",
                 "The initial Trustee shall be Jane Doe of Phoenix, Arizona.")
    # Tamper: change the excerpt without updating the hash.
    fact["provenance"]["source_excerpt"] = "The initial Trustee shall be Mallory of Phoenix, Arizona."
    # excerpt_hash still corresponds to Jane Doe → mismatch.
    result = validate_grounding(DOCUMENT, [fact])
    failures = [f for f in result.failures if f.severity == "tamper_detected"]
    assert len(failures) == 1


def test_attorney_review_required_floor() -> None:
    # Even if the model said low confidence, attorney-review-required forces medium.
    fact = _fact(
        "F5",
        "trust.distribution_rule",
        "50% spouse / 25% children / 25% charity",
        "fifty percent (50%) to the Grantor's spouse, twenty-five percent (25%) to",
        tier="low",
        attorney_review_required=True,
    )
    result = validate_grounding(DOCUMENT, [fact])
    assert result.facts[0]["confidence_tier"] == "medium"


def test_long_excerpt_uses_load_bearing_substring() -> None:
    # Even if the excerpt is longer than GROUND_NEEDLE_LEN, the first 60 chars
    # must appear in the document. This tolerates trailing whitespace differences.
    excerpt = (
        "the trust property shall be distributed\n"
        "fifty percent (50%) to the Grantor's spouse, twenty-five percent (25%) to\n"
        "the children in equal shares per stirpes,"
    )
    assert len(excerpt) > GROUND_NEEDLE_LEN
    fact = _fact("F6", "trust.distribution_rule", "X", excerpt)
    result = validate_grounding(DOCUMENT, [fact])
    assert result.is_clean


def test_excerpt_hash_populated_when_missing() -> None:
    fact = _fact("F7", "trust.x", "y", "Successor Trustee shall be")
    del fact["provenance"]["excerpt_hash"]
    result = validate_grounding(DOCUMENT, [fact])
    expected = hashlib.sha256("Successor Trustee shall be".encode("utf-8")).hexdigest()
    assert result.facts[0]["provenance"]["excerpt_hash"] == expected


def test_multiple_facts_partial_failure() -> None:
    facts = [
        _fact("F8a", "x", "1", "ARTICLE I.  TRUSTEE"),
        _fact("F8b", "y", "2", "this text does not appear anywhere"),
        _fact("F8c", "z", "3", "Phoenix Children's Hospital Foundation"),
    ]
    result = validate_grounding(DOCUMENT, facts)
    assert len(result.failures) == 1
    assert result.failures[0].fact_id == "F8b"
    assert result.facts[0]["confidence_tier"] == "high"  # F8a unchanged
    assert result.facts[1]["confidence_tier"] == "requires_human_review"  # F8b downgraded
    assert result.facts[2]["confidence_tier"] == "high"  # F8c unchanged
