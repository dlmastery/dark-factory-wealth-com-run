#!/usr/bin/env python3
"""
validate_prd_atoms.py — atom provenance validator (lesson L-001).

Validates that an atoms file (PRD-derived, transcript-derived, or any
external-corpus atomization) satisfies the Atom Provenance Protocol at
df-intake-spec-lab/references/atom-provenance-protocol.md.

Usage:
    validate_prd_atoms.py <atoms.json> --source <source-file> [--sample N]

Exits 0 on full pass, non-zero on any failure with a detailed report.

Hard rules enforced:
    1. Every atom has required fields (id, kind, statement, source_file,
       line_start, line_end, source_excerpt, confidence).
    2. line_start/line_end are within the source file's actual line range.
    3. A random sample of N atoms (default 20) has source_excerpt grep-verified
       against the cited source_file.

Derived from RUN-WEALTHCOM-001 INC-001 (2026-04-25). The corrective
re-extraction at TB-WC-2026-0425-002 demonstrated 100% pass on 20-sample
self-grep; this validator codifies that gate.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path

REQUIRED_FIELDS = (
    "id",
    "kind",
    "statement",
    "source_file",
    "line_start",
    "line_end",
    "source_excerpt",
    "confidence",
)
ALLOWED_CONFIDENCE = {"high", "medium", "low"}


def fail(report, msg):
    report["failures"].append(msg)


def warn(report, msg):
    report["warnings"].append(msg)


def load_atoms(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "atoms" in data:
        return data["atoms"]
    if isinstance(data, list):
        return data
    raise ValueError(f"{path} is neither a list of atoms nor a {{atoms: [...]}} object")


def validate_field_presence(atoms: list[dict], report: dict) -> None:
    for idx, atom in enumerate(atoms):
        missing = [f for f in REQUIRED_FIELDS if f not in atom or atom[f] in (None, "")]
        if missing:
            fail(
                report,
                f"atom #{idx} (id={atom.get('id', '<no-id>')}) missing required fields: {missing}",
            )
        conf = atom.get("confidence")
        if conf and conf not in ALLOWED_CONFIDENCE:
            fail(
                report,
                f"atom {atom.get('id')} has confidence={conf!r}; must be one of {sorted(ALLOWED_CONFIDENCE)}",
            )


def validate_line_ranges(atoms: list[dict], source_lines: list[str], report: dict) -> None:
    n_lines = len(source_lines)
    for atom in atoms:
        try:
            start = int(atom.get("line_start", -1))
            end = int(atom.get("line_end", -1))
        except (TypeError, ValueError):
            fail(report, f"atom {atom.get('id')} has non-integer line_start/line_end")
            continue
        if start < 1 or end < 1 or start > n_lines or end > n_lines or start > end:
            fail(
                report,
                f"atom {atom.get('id')} line range {start}-{end} invalid for source with {n_lines} lines",
            )


def validate_source_excerpt_grep(
    atoms: list[dict], source_text: str, sample_size: int, report: dict
) -> None:
    if not atoms:
        return
    sample_size = min(sample_size, len(atoms))
    sample = random.sample(atoms, sample_size)
    report["sample_grep"] = {"requested": sample_size, "checked": [], "failed_ids": []}
    for atom in sample:
        excerpt = (atom.get("source_excerpt") or "").strip()
        if not excerpt:
            report["sample_grep"]["failed_ids"].append(atom.get("id"))
            fail(report, f"atom {atom.get('id')} has empty source_excerpt")
            continue
        # Use a load-bearing substring (first 60 chars or whole if shorter) to
        # accommodate trailing whitespace / line-wrap differences.
        needle = excerpt if len(excerpt) <= 60 else excerpt[:60]
        passed = needle in source_text
        report["sample_grep"]["checked"].append(
            {"id": atom.get("id"), "needle_len": len(needle), "passed": passed}
        )
        if not passed:
            report["sample_grep"]["failed_ids"].append(atom.get("id"))
            fail(
                report,
                f"atom {atom.get('id')} source_excerpt not found in source file (needle len {len(needle)})",
            )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("atoms_file", type=Path)
    parser.add_argument("--source", type=Path, required=True, help="Source corpus file")
    parser.add_argument("--sample", type=int, default=20, help="Random grep sample size (default 20)")
    parser.add_argument("--seed", type=int, default=None, help="RNG seed for reproducibility")
    args = parser.parse_args()

    if args.seed is not None:
        random.seed(args.seed)

    if not args.atoms_file.exists():
        print(f"ERROR: atoms file not found: {args.atoms_file}", file=sys.stderr)
        return 2
    if not args.source.exists():
        print(f"ERROR: source file not found: {args.source}", file=sys.stderr)
        return 2

    atoms = load_atoms(args.atoms_file)
    source_text = args.source.read_text(encoding="utf-8")
    source_lines = source_text.splitlines()

    report: dict = {
        "atoms_file": str(args.atoms_file),
        "source_file": str(args.source),
        "atom_count": len(atoms),
        "source_line_count": len(source_lines),
        "failures": [],
        "warnings": [],
    }

    validate_field_presence(atoms, report)
    validate_line_ranges(atoms, source_lines, report)
    validate_source_excerpt_grep(atoms, source_text, args.sample, report)

    print(json.dumps(report, indent=2))
    return 0 if not report["failures"] else 1


if __name__ == "__main__":
    sys.exit(main())
