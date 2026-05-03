# DDD-001 · Ubiquitous Language Glossary — EstateCompass Demo MVP

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Standards basis:** OMG MDA (CIM), DDD canonical (Evans), domain-brief.md §2-3

The single source of truth for terminology used across the run. Every term has a definition, a context-of-use, and (where applicable) a citation. Code identifiers, database schema names, API field names, UI copy, and test names MUST use these terms verbatim.

## Domain — People & Households

| Term | Definition | Context | Citation |
|---|---|---|---|
| **Household** | Top-level aggregate root. Represents a client family unit; primary unit of work for an advisor. Contains people, entities, assets, documents, plans, tasks. | Slice-2; primary navigation node in the advisor UI. | PRD-canonical §4 (Household entity) |
| **Person** | Natural person — grantor, beneficiary, trustee, executor, agent, attorney-of-record. | Slice-2; many-to-many with Household via Roles. | PRD-canonical §4 |
| **Entity** | Non-natural party — Trust, LLC, Corporation, Foundation. Distinguished from Person. | Slice-2. | PRD-canonical §4 |
| **Role** | Relationship link between a Person/Entity and a Household. e.g., "Jane is the SuccessorTrustee of the Doe Family Trust." | Slice-2; uses RoleType enum. | Domain decomposition |
| **Tenant** | Advisor firm. Top-level isolation boundary. Households belong to a tenant; users authenticate to a tenant. | All slices; ADR-002. | ADR-002 |

## Domain — Trusts

| Term | Definition | Context | Citation |
|---|---|---|---|
| **Trust** | Subtype of Entity. A legal arrangement where a trustee holds property for beneficiaries. v0 supports: RevocableTrust, GRAT, DynastyTrust placeholders. | Slice-2 / Slice-6. | domain-brief §2 |
| **Grantor** | Person who creates a trust and contributes property. (Synonym: Settlor.) | Slice-2. | domain-brief §2 |
| **Trustee** | Person/Entity with fiduciary duty to administer the trust. | Slice-2. | domain-brief §2 |
| **Beneficiary** | Person/Entity entitled to benefit from a trust. | Slice-2. | domain-brief §2 |
| **DistributionRule** | Rule governing how/when beneficiaries receive trust property. Examples: "outright on age 25," "income for life of spouse, remainder to children." | Slice-4 extraction target; Slice-6 modeling. | PRD-canonical §6 |
| **GRAT** | Grantor Retained Annuity Trust (IRC §2702). Grantor retains an annuity stream for a fixed term; remainder passes to beneficiaries. "Zeroed-out" / Walton GRAT minimizes gift tax. | Slice-6 — the ONE scenario in MVP. | domain-brief §2 + IRC §2702 |
| **Section 7520 rate** | IRS published interest rate used to value annuity/remainder interests in GRATs and similar split-interest trusts. Updated monthly. | Slice-6 calc. | IRS guidance; domain-brief §2 |
| **DynastyTrust** | Trust designed to last multiple generations using GST exemption. v0 placeholder; not modeled in scenario calc. | Slice-2 entity type only. | domain-brief §2 |
| **RevocableTrust** | Trust the grantor can amend or revoke. Becomes irrevocable at grantor's death. | Slice-2 entity type. | domain-brief §3 |

## Domain — Tax & OBBBA

| Term | Definition | Context | Citation |
|---|---|---|---|
| **OBBBA** | One Big Beautiful Bill Act, signed July 4, 2025. **Permanently** raised the federal estate / gift / GST exemption to **$15M (2026)** with annual inflation adjustment. Repealed the TCJA sunset that was scheduled for 12/31/2025. | All tax leaves. | FACT-OBBBA-001; domain-brief §1 |
| **Federal estate tax** | Tax on transfer of property at death. Top rate 40%. Exemption per OBBBA = $15M (2026). | Slice-5. | IRC §2001; domain-brief §1 |
| **DSUE** | Deceased Spousal Unused Exclusion. Portability allows surviving spouse to use unused portion of deceased spouse's federal exemption. | Slice-5 calc. | IRC §2010(c); domain-brief §1 |
| **Step-up in basis** | Cost basis of inherited assets reset to fair market value on death date. Eliminates capital-gains tax on pre-death appreciation. | Domain context; not in v0 calc scope. | IRC §1014; domain-brief §1 |
| **GST tax** | Generation-Skipping Transfer tax. Applies to transfers to "skip persons" (grandchildren+). Has its own exemption ($15M post-OBBBA). | Domain context; v0 placeholder only. | IRC Chapter 13; domain-brief §1 |
| **TaxableEstate** | Gross estate − deductions − exemption (OBBBA $15M). | Slice-5 calc. | IRC §2001 |
| **GrossEstate** | Sum of probate property, jointly-held property, life insurance proceeds, retirement accounts, and certain transfers. | Slice-5 calc. | IRC §2031 |

## Domain — Documents & Extraction

| Term | Definition | Context | Citation |
|---|---|---|---|
| **Document** | Uploaded estate instrument: will, trust, POA, AHCD, beneficiary designation, etc. | Slice-3. | PRD-canonical §3 |
| **DocumentType** | Enum: WILL, REVOCABLE_TRUST, IRREVOCABLE_TRUST, POA, AHCD, BENEFICIARY_DESIGNATION, OTHER. | Slice-3 / Slice-4. | Domain decomposition |
| **WORMAuditEntry** | Immutable audit log row. Append-only at the database layer (REVOKE UPDATE/DELETE on app role). 7-year retention minimum (FINRA Rule 17a-4 alignment). | All slices. | ADR-002; FINRA Rule 17a-4 |
| **ExtractedFact** | Structured datum from an extraction run. Carries provenance (document_id + page + source_excerpt + excerpt_hash), confidence (0-1), confidence_tier (high/medium/low/requires_human_review). | Slice-4. | ADR-003; `packages/contracts/extraction.json` |
| **ConfidenceTier** | High (≥0.92): auto-accept. Medium (0.70–0.92): auto-accept unless `attorney_review_required`. Low (<0.70): NEVER auto-accept; advisor reviews. RequiresHumanReview: extraction failed/refused. | Slice-4 routing logic. | ADR-003 |
| **AttorneyReviewRequired** | Boolean flag on field-paths whose facts always require attorney review (parties, distribution rules, beneficiary identification, trustee succession, GST/tax elections). | Slice-4 routing. | HD-007; ADR-003 |
| **GroundingValidator** | Post-extraction check that every fact's `source_excerpt` appears verbatim in the document; else downgrade tier to RequiresHumanReview. | Slice-4. | ADR-003 |
| **Holdout dataset** | Public-corpus estate documents (open law school sample wills, public probate filings) used to evaluate Sage extractor independent of any wealth.com or PRD content. NOT in training data. | Slice-4 evaluation. | ADR-003; OQ-INTAKE-005 (selection task carried to construction) |

## Domain — Calculations

| Term | Definition | Context | Citation |
|---|---|---|---|
| **CalcRule** | Pure function: input → output. Identified by `rule_id` (e.g., `RULE-FET-OBBBA-2026`). Has citation. | apps/calc-engine. | ADR-001 |
| **GoldenDatasetCase** | A `(rule_id, input, expected_output, citation)` tuple. Used as deterministic test for the calc engine. | apps/calc-engine/tests/golden/. | DOD-3 |
| **ComputationTrace** | Persisted record of a calculation: `{rule_id, inputs, output, citation, computed_at, computation_version}`. Written to WORM audit log. | All calc invocations. | ADR-001 |
| **ScenarioComparison** | Two or more deterministic projections side by side. v0: GRAT vs do-nothing for $20M household. | Slice-6. | CC-001 |

## Domain — UI / Workflow

| Term | Definition | Context | Citation |
|---|---|---|---|
| **AdvisorWorkbench** | Primary advisor UI surface. Login → dashboard → household list → household detail → upload → extraction review → tax view → scenario view. | Slice-9. | CC-001; PRD-canonical §3 |
| **Disclaimer** | UPL-required text on every advisor-facing screen: "EstateCompass produces educational drafts and informational summaries; an attorney of record must review all documents before execution. EstateCompass is not a law firm and does not provide legal advice." | Slice-9; FR-UI-DISCLAIMER-001. | HD-007; ADR-003 |
| **EvidenceBadge** | UI element that surfaces an ExtractedFact's confidence tier + provenance excerpt on hover/tap. | Slice-9. | ADR-003 |

## Cross-cutting & meta

| Term | Definition | Context | Citation |
|---|---|---|---|
| **RALPH loop** | Review → Attack → Learn → Patch → Harden. Minimum 5 loops per governed artifact. | All artifacts. | df-quality-refinery |
| **Hawkeye** | Independent conformance auditor persona; veto authority; cannot be the same role that authored the audited content. | All stage exits. | df-meta-attractor |
| **Refusal honesty** | Property of the Sage extractor: when a fact cannot be grounded in a document, emit `requires_human_review` rather than a hallucinated value. | Slice-4. | ADR-003 |
| **Anti-overfit transfer test** | Apply the factory to a different fintech surface (e.g., Holistiplan-style tax-baseline mini-app) before run closure. Validates that the factory is the dark-factory pattern, not wealth.com hardcoded. | TB-WC-2026-0508-021. | RSK-005 |

## Forbidden terms (registered marks; brand substitution per HD-002)

The following terms are **wealth.com registered marks** and MUST NOT appear in any code identifier, database column, API field, UI copy, marketing copy, or test name in this run. Brand-substitution CI gate (`apps/web/ci/check-no-marks.ts`) MUST be implemented in Slice-9.

- Ester®, Ester™, Ester Intelligence®
- Extractor by Ester™
- Family Office Suite™
- EstateFlow™
- Heritage Map (in wealth.com's specific visualization sense)
- Plan for Every Tomorrow™
- Wealth.com Tax Planning™

Substitution rules:
- Use **Sage** instead of Ester
- Use **EstateCompass** instead of wealth.com
- Use **HouseholdSummary** instead of Family Office Suite
- Use **EstateGraph** instead of Heritage Map / EstateFlow

## Trace links

- Source intent: PRD-canonical.md, domain-brief.md, ATTR-WEALTHCOM-001
- Implements: GOV-001 §7 constraints; ADR-001/002/003; HD-002 brand substitution
- Consumed-by: Slice-1..9 code (all identifiers conform); future LLDs (DDD-002 context map, LLD-* per slice)
- Verified-by: brand-substitution CI gate (forbidden terms); naming-consistency lint
