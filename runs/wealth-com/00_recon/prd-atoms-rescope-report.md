# PRD Atoms Re-Scope & Re-Tag Report

**Source:** `runs/wealth-com/00_recon/prd-atoms.json` (212 atoms)
**Generated:** 2026-04-25
**Tagged file:** `prd-atoms-tagged.json`
**Filtered file (Stage-1 input):** `prd-atoms-demo-mvp-filtered.json`

## Tallies

- **Total atoms:** 212
- **Atoms with OBBBA supersession:** 9
  - exact count: 9
- **Atoms `in_scope_demo_mvp`:** 64
- **Atoms `out_of_scope_demo_mvp_deferred`:** 51
- **Atoms `context_only`:** 97

_Sanity: 64 + 51 + 97 = 212 (should equal 212)._

## Top 10 OBBBA-Superseded Atoms

| ID | Surface | Brief |
|---|---|---|
| PRD-0042 | Tax Planning | TCJA sunset triggers reduction of federal estate/gift exemption from ~$13.61M per individual (2025) to ~$7M in 2026. |
| PRD-0043 | Tax Planning | Married couples' combined exemption halves from ~$27.2M to ~$14M post-TCJA sunset. |
| PRD-0101 | Advisor Workbench | Task Center reminders driven by life events, tax-law triggers, plan-health signals, and portal activity. |
| PRD-0143 | Tax Planning | Tax Planning Agent v2 ships Q3 2026 with multi-state TCJA-sunset modeling. |
| PRD-0149 | Platform | R-10 risk: TCJA sunset legislative extension or unexpected modification (Score 9). |
| PRD-0151 | Platform | Open question: Will the TCJA sunset be extended or modified by Congress in 2026-2027? |
| PRD-0153 | Platform | Assumption: TCJA sunset occurs as currently legislated (owner CPO). |
| PRD-0157 | Tax Planning | Sample scenario: 2026 TCJA exemption $7M; SLAT funding $5M; baseline estate tax $4.2M reduced to $1.1M (savings $3.1M). |
| PRD-0208 | Tax Planning | Sample scenario JSON: baselineEstateTax 12400000, optimizedEstateTax 3200000, savings 9200000, TCJA 2026 exemption $7M. |

## Top 10 In-Scope Demo MVP Atoms (one per surface where possible)

| ID | Surface | Kind | Brief |
|---|---|---|---|
| PRD-0002 | Platform | capability | Wealth.com markets itself as an AI-powered estate and tax planning platform. |
| PRD-0010 | Ester AI | capability | Ester is described as a proprietary, deterministic AI engine. |
| PRD-0065 | Estate Scan | nfr | Estate Scan ingestion target < 30 seconds for typical 20-page document. |
| PRD-0097 | Client Portal | capability | Client Portal authentication: MFA (authenticator/SMS/hardware key), magic-link email, SSO via SAML/OIDC. |
| PRD-0181 | Tax Planning | rule | Section 7520 rate is a slider input in real-time projections. |
| PRD-0012 | Platform | compliance | Platform claims SOC 2 Type II compliance with encryption at rest/transit. |
| PRD-0018 | Ester AI | ai | Ester comprises specialized agents — Estate Planning Agent (all customers) and Tax Planning Agent (Tax Planning customer |
| PRD-0053 | Ester AI | capability | Five strategic pillars: AI-Native Deterministic Outputs, Enterprise Security, Seamless Integrations, Advisor-Led Client  |
| PRD-0058 | Platform | architecture | Architecture organized in six logical layers: Presentation, AI/Intelligence, Data Services, Execution, Integration, Secu |
| PRD-0059 | Platform | architecture | Frontend stack: React 18 + TypeScript, Tailwind CSS, TanStack Query, Recharts; monorepo via Nx. |

## Anti-Slop Self-Check (5 random atoms)

### PRD-0164 — surface `Document Creation` / kind `metric` / scope `out_of_scope_demo_mvp_deferred`

**Statement:** US-7.2 acceptance criteria: Ester pre-population from scan auto-populates 85%+ of fields in new amendment draft.

**Rationale:** Document Creation surface (POA/Trust drafting) deferred per CC-001 — UPL complexity.

**Reviewer note:** Classification consistent with CC-001 demo-MVP scope and FACT-OBBBA-001.

### PRD-0029 — surface `Platform` / kind `entity` / scope `context_only`

**Statement:** PRD describes Ester rebrand: April 14, 2026 announcement marked Ester Intelligence Enters a New Era.

**Rationale:** Company history / market-context entity — not a Demo MVP build requirement.

**Reviewer note:** Classification consistent with CC-001 demo-MVP scope and FACT-OBBBA-001.

### PRD-0007 — surface `Platform` / kind `metric` / scope `context_only`

**Statement:** PRD claims 1,000+ firms went live on the Tax Planning module within two months of launch.

**Rationale:** Background metric/persona/competitive/roadmap/risk — not a buildable Demo MVP requirement.

**Reviewer note:** Classification consistent with CC-001 demo-MVP scope and FACT-OBBBA-001.

### PRD-0190 — surface `Platform` / kind `compliance` / scope `in_scope_demo_mvp`

**Statement:** AI prompt/response logging anonymized at ingestion (PII redacted) yet fully reconstructible for internal audits.

**Rationale:** Document vault / audit log baseline required for Slice 3.

**Reviewer note:** Classification consistent with CC-001 demo-MVP scope and FACT-OBBBA-001.

### PRD-0071 — surface `Document Creation` / kind `integration` / scope `out_of_scope_demo_mvp_deferred`

**Statement:** E-signature via DocuSign and Notarize APIs; mobile notary via Sign Here Ink in all 50 states.

**Rationale:** Document Creation surface (POA/Trust drafting) deferred per CC-001 — UPL complexity.

**Reviewer note:** Classification consistent with CC-001 demo-MVP scope and FACT-OBBBA-001.

## Notes

- All original fields (id, kind, surface, statement, source_excerpt, line numbers, confidence, open_question) preserved verbatim.
- Where ambiguous, atom was conservatively kept `in_scope_demo_mvp` per task hard-rule.
- Tax-Planning surface tightly filtered: only federal-estate-tax baseline + GRAT-related atoms IN; 1040/W-2/multi-form ingestion + multi-strategy library OUT.
- Ester AI surface: extraction architecture / RAG / deterministic-grounding kept IN (Slice 4); deployment/embedded variants and voice OUT.
- Surfaces fully deferred per CC-001: Document Creation, Family Office Suite, Estate Visualizer, Ownership Balance Sheet, Report Builder, Integrations Hub (beyond 2 mocks), Client Portal.