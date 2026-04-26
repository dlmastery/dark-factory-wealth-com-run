# Wealth.com PRD — Canonical Distillation (Citation-Grounded)

> Source: `wealth_com_PRD_transcript.md` (5,687 lines, 549,243 chars). All atom IDs in this doc reference `prd-atoms.json` in the same folder. Every claim below has at least one matching atom with a verbatim source_excerpt.

## Executive Summary

Wealth.com is positioned by the PRD as an AI-native estate and tax planning platform for advisors, RIAs, family offices, broker-dealers, and private banks (PRD-0002, PRD-0011). Its proprietary AI engine, Ester, is described as deterministic and citation-grounded, organized as a system of five specialized agents (PRD-0010, PRD-0072). The Series B was a $65M oversubscribed round closed April 16, 2026 with new investors Titanium Ventures, Pruven Capital, The K Fund, and Dynasty Financial Partners (PRD-0013, PRD-0014); returning participants included GV, Charles Schwab, and Citi Ventures (PRD-0015). The PRD claims 664% YoY growth in AI workflows (PRD-0006), 100,000+ documents processed by Ester in 2025 (PRD-0008), and 1,000+ firms live on Tax Planning within two months of launch (PRD-0007). The market thesis ties to a Cerulli-projected $84T great wealth transfer (PRD-0021, PRD-0197) and the 2026 TCJA exemption halving from ~$13.61M to ~$7M per individual (PRD-0042). HQ is Tempe, AZ with ~150-170 employees and a planned NYC office in May 2026 (PRD-0017, PRD-0038).

## Personas (PRD-asserted only)

The PRD defines seven personas with explicit names. Note: these are PRD-internal personas, not real customers (callers should treat as illustrative).
- **Sarah Thompson** — Senior Wealth Advisor at Horizon Wealth Partners ($2.1B AUM RIA, Scottsdale AZ), age 52 (PRD-0046).
- **Marcus Rivera** — Director of Compliance & Risk at Apex Wealth Group ($18B AUM hybrid RIA/BD, 420 advisors), age 44 (PRD-0047).
- **Elena Petrova** — Principal at Petrova Family Office (8 UHNW families, ~$1.2B), age 58 (PRD-0048).
- **Jake Harlan** — Junior Advisor & Paraplanner at Carson Group, age 31 (PRD-0049).
- **David Ellison** — UHNW client age 68, $50M+ net worth post $28M company sale (PRD-0050).
- **Priya Sharma** — Tech executive age 45, $5M net worth (RSU growth) (PRD-0051).
- **Robert Kline** — Manufacturing CEO age 57, $22M net worth (70% QSBS) (PRD-0052).

## Product Surfaces

### Ester AI (PRD-0010, PRD-0029, PRD-0210)
- Five specialized agents: Estate Planning, Tax Planning, Document Extraction, Visualization, Q&A (PRD-0072).
- Originally branded EstateGuide in 2023; rebranded to Ester Intelligence 2025-2026 (PRD-0210).
- April 14, 2026 announcement: "Ester Intelligence Enters a New Era," elevated to Level 3 teammate (PRD-0193).
- Deterministic logic layer wraps every LLM call; numerical grounding to 0.0001 tolerance (PRD-0165).
- Three memory scopes: per-household long-term (vector embeddings), plan-version snapshots, session memory (Redis) (PRD-0173).
- Document Extraction Agent claims >98% accuracy on standard instruments (PRD-0073).
- Deployment: native UI, AI-as-a-Service, embedded SDK/iframe, REST API, MCP Server (PRD-0075).
- Pricing: Starter $49/seat/mo (50 docs); Professional $149/seat/mo (500 docs); Enterprise custom (PRD-0076).

### Document Creation (Section 7) (PRD-0068, PRD-0069, PRD-0070)
- Templates cover all 50 states + DC, validated by in-house attorney panel (PRD-0068).
- Supports revocable trusts, pourover wills, Last W&T, Financial DPOA, AHCD, HIPAA, guardianship (Section 7.1.2).
- Irrevocable structures: SLATs, IDGTs, GRATs, CRT/CRUT/CRAT, ILITs, QPRTs, dynasty/GST trusts (PRD-0069).
- Beneficiary deeds/TOD: 30+ states (expanding) (PRD-0161).
- Workflow: questionnaire (12-18 min) → Ester first draft <60s → attorney review → e-sign → vault (PRD-0070, PRD-0178).
- Pre-population from prior Estate Scan: ≥85% field auto-fill (PRD-0164).
- E-signature via DocuSign + Notarize APIs; mobile notary via Sign Here Ink in all 50 states (PRD-0071).
- RON supported in 47+ jurisdictions (PRD-0163).
- Vault RBAC: Advisor edit drafts; Client view+sign; Attorney review/approve; Family read-only post-execution; Emergency-time-limited (PRD-0188).

### Estate Scan (Section 9) (PRD-0077, PRD-0078, PRD-0079, PRD-0080)
- ~500 structured elements extracted across 18 categories (PRD-0077).
- Per-field confidence scoring 0-100; <85% routes to human-in-the-loop queue (PRD-0078).
- KPIs: ≥95% field-level extraction, ≥99% trust-level summary, <15% human review rate (PRD-0079).
- Channels: drag&drop, email-in (`@scan.wealth.com`), API, batch up to 500 docs (PRD-0080).
- 4-layer pipeline: pre-processing → OCR/layout → LLM extractor → deterministic post-processing (Section 9.1.1).
- US-9.1: <20 seconds end-to-end with ≥98% confidence on clean PDF (PRD-0200).

### Estate Visualizer (Section 10) (PRD-0081, PRD-0082, PRD-0083, PRD-0084)
- D3.js v7 + React Flow v12+ + Konva.js/Three.js for WebGL rendering (PRD-0081).
- Heritage Map: 3-5 generations, time-slider 5/10/20/30 years (PRD-0082).
- Two synchronized render modes: Client-Friendly vs Advisor/Attorney (PRD-0083).
- WCAG 2.1 AA compliance (PRD-0084).
- Performance: <150ms initial render for 50-beneficiary; P95 <400ms what-if (PRD-0177).
- Heritage Map renders thousands of nodes at 60fps on mobile (PRD-0205).

### Family Office Suite (Section 11) (PRD-0085, PRD-0086, PRD-0087)
- Manages 8-100+ entities across multiple households (PRD-0085).
- Canonical hierarchy: Revocable Trust → sub-trusts → dynasty/GST → ILIT → FLP/LLC → operating businesses (PRD-0087).
- GST tracking: allocated exemption + inclusion ratio (0.00-1.00) (PRD-0086).
- Sample: dynasty trust with $13.5M allocated exemption (PRD-0189).

### Ownership Balance Sheet (Section 12) (PRD-0088, PRD-0089, PRD-0090, PRD-0091, PRD-0092)
- Death-sequence simulation: primary, simultaneous, common disaster, successive within 30 days (PRD-0089).
- Conflict severity: Critical, High, Medium with one-click resolution (PRD-0090).
- Asset integrations: Carta (PE), Coinbase/Anchorage Digital (crypto), Zillow (real estate) (PRD-0091).
- Reconciliation: ±2% value tolerance triggers manual review (PRD-0092).

### Tax Planning (Section 13) (PRD-0093, PRD-0094, PRD-0095, PRD-0096)
- Module launched January 27, 2026 (PRD-0093).
- Forms: 1040+Schedules, state returns (50+DC), 1041, 706, 709, K-1s (PRD-0094).
- Pipeline >96% field-level accuracy (PRD-0095).
- Opportunity categories: QSBS Section 1202, Roth Ladder, CLT/CRT/CRUT, 529 Superfunding, NUA, GRAT laddering, basis step-up, SLAT/IDGT, Opportunity Zone (PRD-0096).
- Section 7520 rate is a slider input (PRD-0181).
- Sample scenarios: $12.4M baseline → $3.2M optimized; or $4.2M → $1.1M (PRD-0157, PRD-0208) — note divergent example baselines.

### Client Portal (Section 14) (PRD-0097, PRD-0099, PRD-0100)
- Authentication: MFA (TOTP/SMS/hardware), magic-link, SAML/OIDC SSO (PRD-0097).
- Vault sharing: 7/30/90-day expiring links, password-protected, watermarked PDFs (PRD-0099).
- Spanish-language fully localized; additional languages on roadmap (PRD-0100).
- 3-5x faster plan completion + 40%+ next-gen retention (PRD-0098, low confidence).

### Advisor Workbench (Section 15) (PRD-0101, PRD-0102, PRD-0176)
- Smart reminders driven by life events, tax-law triggers, plan health, portal activity (PRD-0101).
- Book-of-business segments: High-Opportunity, Lapsed/At-Risk, Multi-Generational, Business Owners (PRD-0102).
- Bulk action: select 200 high-opportunity clients and send personalized scan-request emails (PRD-0176).

### Report Builder (Section 15.2) (PRD-0103)
- No-code drag-and-drop studio; PDF, PPT, secure portal-link export.

### Integrations Hub (Section 17) (PRD-0107, PRD-0108, PRD-0109, PRD-0110, PRD-0111, PRD-0112)
- 30+ partners; >25 live as of April 2026.
- Live CRM: Salesforce FSC, Redtail, Wealthbox; Practifi in-progress (PRD-0108, PRD-0109).
- Custodians: Schwab, Fidelity Wealthscape, Pershing, Goldman Sachs Custody Solutions (PRD-0110).
- Advyzon all-in-one platform integration is live (PRD-0192).
- MCP Server for on-prem/VPC Ester deployment (PRD-0111).
- API rate limits: Starter 1k/day, Professional 50k/day, Enterprise unlimited (PRD-0112).

### Platform / Architecture (Section 6) (PRD-0058, PRD-0059, PRD-0060, PRD-0061, PRD-0062)
- Six-layer architecture: Presentation, AI/Intelligence, Data Services, Execution, Integration, Security/Observability (PRD-0058).
- Stack (PRD-prescribed; verify): React 18+TS+Tailwind+Radix; NestJS Node services; Python 3.12 FastAPI for AI; Postgres 16 with pgvector; Pinecone secondary; S3; Redis 7 (PRD-0059, PRD-0060, PRD-0061, PRD-0062).
- Design tokens: deep navy `#0A2540`, soft sage `#E8F0E8` (PRD-0126).
- White-label custom domains `advisor.yourfirm.com` (PRD-0184).

## Domain Entities

Core data model entities (PRD-0063): EstateDocument, Beneficiary, Asset, Household, Entity/Trust, Person, PlanVersion, AuditEvent. Sample household JSON (PRD-0189) shows familyOfficeFlag, blendedFamily, jurisdictions array, entities array with gstInclusionRatio and allocatedExemption. Sample asset shows titling enum (INDIVIDUAL, JTWROS, TBE, REVOCABLE_TRUST, etc.).

## Workflows

### W-1 AI-Assisted Drafting (lines 1453-1473)
1. Dynamic questionnaire pre-populated from CRM/Estate Scan (12-18 min) (line 1453).
2. Ester generates first draft <60s (line 1456).
3. Auto-routes to attorney panel for mandatory review (line 1456).
4. Versioning maintained in PlanVersion (line 1458).
5. E-sign via DocuSign/Notarize; mobile notary scheduled within 48h (line 1464).
6. Vault storage with RBAC + AuditEvent logging (lines 1469-1475).

### W-2 Estate Scan Ingestion (lines 1929-1953)
1. Pre-processing (validation, dedup, language detection).
2. AWS Textract + Donut-style layout-aware extraction.
3. Ester Document Extraction Agent (fine-tuned VLM) — semantic understanding.
4. Deterministic post-processing rule engine (Python, attorney-maintained).
5. Field-level confidence scoring; <85% → review queue.
6. Async enrichment via event bus (lines 1977-1985): balance sheet matching, tax data, household graph.

### W-3 Tax Scenario (lines 2856-2895)
1. Ingest Form 1040/state/1041/706/709/K-1 (drag-drop, email-in, API, batch).
2. Multi-year, multi-jurisdictional baseline computed; TCJA sunset modeled by default.
3. Slider what-ifs: rates, market returns, lifespan, tax-law changes.
4. Side-by-side baseline vs optimized; PlanVersion snapshot recorded.
5. Reports generated with attorney/CPA review stamps.

### W-4 Beneficiary Conflict Resolution (lines 2596-2606)
1. Continuous proactive scan across household graph.
2. Severity tagging (Critical/High/Medium).
3. One-click resolution path generates amendment draft or beneficiary change form.
4. Dual approval (advisor + client/attorney) required; immutable audit log.

## Calculations & Rules

- TCJA exemption halving: ~$13.61M (2025) → ~$7M (2026), married ~$27.2M → ~$14M (PRD-0042, PRD-0043; line 641).
- GST inclusion ratio: 0.00-1.00 with audit trail (PRD-0086; line 2393).
- Numerical grounding tolerance: 0.0001 (PRD-0165; line 4031).
- Per-field confidence routing threshold: 85% (PRD-0078; line 1970).
- Balance-sheet reconciliation tolerance: ±2% (PRD-0092; line 2635).
- Policy engine latency budget: <50ms (PRD-0166; line 4040).
- Prompt-cache hit response: <80ms with zero LLM tokens (PRD-0199; line 4074).
- Canary rollout: 5% traffic shadow for 48 hours (PRD-0125; line 4054).
- QSBS Section 1202: up to 100% gain exclusion on stock held 5+ years (PRD-0201; line 5486).
- RMD: starts at age 73 (PRD-0202; line 5488).

## Integrations

| Partner | Status | Auth | Direction | Cadence | Atom |
|---|---|---|---|---|---|
| Salesforce FSC | Live | OAuth2+SAML | Bidirectional | Real-time + daily | PRD-0108 |
| Redtail | Live | OAuth2 | Bidirectional | Real-time + hourly | PRD-0109 |
| Wealthbox | Live | OAuth2 | Bidirectional | Real-time + hourly | PRD-0109 |
| Practifi | In-progress | OAuth2 | Bidirectional | Daily | line 3668 |
| Orion | Live | OAuth2+API key | Bidirectional | Real-time + nightly | line 3669 |
| Black Diamond | Live | OAuth2+mTLS | Bidirectional | Real-time + nightly | line 3670 |
| Addepar | Live | OAuth2 | Bidirectional | Real-time + nightly | line 3671 |
| Envestnet Tamarac | Live | OAuth2 | Bidirectional | Nightly + on-demand | line 3672 |
| eMoney | Live | OAuth2 | Bidirectional | Real-time + nightly | line 3673 |
| MoneyGuidePro | Live | OAuth2 | Bidirectional | Nightly + on-demand | line 3674 |
| RightCapital | Live | OAuth2 | Bidirectional | Nightly | line 3675 |
| Holistiplan | Import-only | API key | Inbound | On-demand | line 3676 |
| Schwab Custodial | Live | OAuth2+API key | Bidirectional | Real-time + nightly | PRD-0110 |
| Fidelity Wealthscape | Live | OAuth2 | Bidirectional | Nightly | PRD-0110 |
| Pershing | Live | OAuth2+mTLS | Bidirectional | Nightly | line 3679 |
| Carta | Live | OAuth2 | Inbound | Nightly + on-demand | PRD-0091 |
| Coinbase Institutional | Live | OAuth2+API key | Inbound | Real-time + hourly | line 3681 |
| Anchorage Digital | Live | OAuth2+mTLS | Inbound | Nightly | line 3682 |
| Plaid | Live | OAuth2 | Inbound | Real-time | line 3683 |
| Zillow | Live | API key | Inbound | Nightly + on-demand | line 3684 |
| DocuSign | Live | OAuth2 | Bidirectional | Real-time webhooks | PRD-0071 |
| Notarize | Live | OAuth2 | Bidirectional | Real-time | line 3686 |
| Microsoft 365 / Entra ID | Live | SAML/OAuth2 | SSO+calendar | Real-time | line 3687 |
| Google Workspace | Live | SAML/OAuth2 | SSO+calendar | Real-time | line 3688 |
| Snowflake/Databricks | Live | mTLS+API key | Outbound | Scheduled batch | line 3689 |
| Advyzon | Live | OAuth2 | Bidirectional | Real-time + nightly | PRD-0192 |
| Goldman Sachs Custody | Live | OAuth2 | Bidirectional | Real-time | line 3691 |
| Arch (alternatives) | Live | API key | Inbound | Nightly | line 3692 |
| Zocks/Jump | Live | OAuth2 | Bidirectional | Real-time | line 3693 |

## AI/ML Capabilities

- Section 19 — proprietary fine-tuned models on a 1.2M-document legal/tax corpus (PRD-0118; line 4003).
- LoRA adapters on Llama-3.1-70B-class base — *PRD-prescribed; not externally verified* (PRD-0119; line 4003).
- Frontier orchestration via Azure OpenAI GPT-4o + Anthropic Claude 3.5 Sonnet on AWS Bedrock PrivateLink — *PRD-prescribed* (PRD-0120; line 4003).
- Embedding model: BGE-large-en-v1.5 + E5-mistral-7b-instruct, fine-tuned on 800k+ passages, 1024-dim, cosine threshold 0.78 (PRD-0122; line 4017).
- Vector store: pgvector primary + Pinecone secondary (PRD-0179; line 4018).
- Reranker: Cohere rerank-english-v3 or in-house BGE-reranker; top-12 chunks injected (PRD-0123; line 4019).
- Memory: per-household, plan-version, session (PRD-0173; lines 1706-1708).
- Chunking: clause-level, 200-600 tokens with metadata (PRD-0174; line 1713).
- Prompt caching reduces token spend 40-60% (PRD-0121; line 4007).
- Five agents: Estate, Tax, Document Extraction, Visualization, Q&A (PRD-0072; lines 1677-1683).
- Section 19 evaluation: 1,500+ golden docs; F1 ≥0.97; hallucination <0.5%; calc determinism 100% (PRD-0124; lines 4043-4048).
- Section 8 evaluation: 1,000+ golden docs; ≥98% extraction; <0.1% hallucination (PRD-0074; lines 1731-1736).
- **Contradiction**: Section 8 vs Section 19 cite different golden-set sizes (1,000+ vs 1,500+) and different hallucination rates (<0.1% vs <0.5%) — see open questions.
- AI red-team: quarterly internal + external (PRD-0168; line 4057).
- Drift monitoring: weekly statistical tests (PRD-0167; line 4055).

## Compliance / Security / Privacy

- SOC 2 Type II annual audit (PRD-0012, PRD-0115; line 3870).
- Additional certifications: ISO 27001, CCPA/CPRA, GDPR, HIPAA, GLBA, NIST CSF 2.0, NIST AI RMF 1.0 (PRD-0115).
- Encryption at rest: AES-256 with KMS; per-doc keys; BYOK/CMK (PRD-0113; line 3861).
- TLS 1.3 in transit, with 1.2 fallback (PRD-0114; line 3862).
- RBAC + ABAC, 40+ permission scopes (PRD-0116; line 3882).
- Breach SLAs: 15-min detect, 1-hour contain, 72-hour customer notice (PRD-0117; line 3885).
- Audit trail: S3 Object Lock WORM, 7-year minimum retention (PRD-0104; line 3558).
- AI prompt logs anonymized at ingestion, fully reconstructible (PRD-0190; line 3568).
- Compliance basis: SEC Rule 204-2 (5-yr min), FINRA 17a-4(f) WORM, state UPL boundaries (PRD-0106; lines 3574-3576).
- Disclaimer language: "This is not legal or tax advice; consult your licensed professional" (PRD-0182; line 3576).
- Output blocked when construed as practicing law without attorney/CPA review (PRD-0169; line 3576).
- Sample audit JSON includes promptHash, modelVersion, citations, guardrailStatus, deterministicValidation (PRD-0180; lines 3534-3543).
- Firm-level governance: four-eyes review for irrevocable trusts; supervisor sign-off for $10M+ assets (PRD-0191; line 3583).

## Reporting

- Custom Report Builder: drag-and-drop, no-code, PDF/PPT/secure-link exports (PRD-0103; line 3303).
- Visualizer exports: PDF, PNG/SVG, interactive embed link, push to Addepar/Black Diamond/eMoney (line 2218-2223).
- Performance dashboards: advisor (docs/plans/AUM/hours), firm (NPS, hours saved, plan completeness, ROI) (Section 15.2.2).
- Audit Evidence Pack: ZIP with WORM logs + version history + chain-of-custody (line 3578).

## NFRs

- Ester Q&A latency P95 <2s (PRD-0064; line 1282).
- Estate Scan ingestion <30s for 20-page document (PRD-0065; line 1283).
- Platform uptime 99.95% with multi-region failover (PRD-0066; line 1284).
- Document drafting <8s for standard revocable trust (PRD-0067; line 1285).
- Visualizer initial render <150ms for 50-beneficiary (PRD-0177; line 2194).
- Heritage Map: 60fps on mobile (PRD-0205; line 2192).
- Cache hit response <80ms (PRD-0199; line 4074).
- Policy engine <50ms (PRD-0166; line 4040).

## Open Questions and Contradictions

### Open Questions captured directly from PRD §25.2 (lines 5277-5306)
1. Will TCJA sunset be extended/modified by Congress in 2026-2027? (PRD-0151)
2. How will state UPL laws evolve for AI-generated legal documents? (PRD-0152)
3. Will major custodians launch competing in-house AI estate tools? (PRD-0203)
4. Long-term viability of zero-data-retention guarantees from foundation-model providers? (PRD-0204)
5-30. (See PRD lines 5281-5306 — 26 additional questions.)

### Contradictions detected during extraction
1. **Total capital raised**: Section 1 (line 356) says "approximately $110 million"; Section 2 (line 485) says "approximately $111 million" (PRD-0016, PRD-0032).
2. **Golden test set size**: Section 8 (line 1731) says "1,000+ documents"; Section 19 (line 4043) says "1,500+ documents" (PRD-0074, PRD-0124).
3. **Hallucination rate**: Section 8 says "<0.1%"; Section 19 says "<0.5%" (PRD-0074, PRD-0124).
4. **Tax scenario sample baselines diverge**: Section 13 sample shows $12.4M baseline → $3.2M; Section 26.2 example shows $4.2M → $1.1M (PRD-0157, PRD-0208).

### Atoms flagged as low-confidence / vague (per Hawkeye protocol)
- PRD-0002 — "industry-leading" claim
- PRD-0088 — "$180M+ in potential beneficiary disputes prevented" (PRD-internal estimate, no external citation)
- PRD-0098 — "3-5× faster" / "40%+ next-gen retention" (PRD aspirational)
- PRD-0105 — "12 million auditable events" (PRD-internal metric)
- PRD-0196 — Vanilla "200% revenue growth" attribution (PRD attributes to Vanilla but no external link in source)
- PRD-0212 — "$15T+ combined firm AUM" (PRD aspirational)
- PRD-0119, PRD-0120, PRD-0122 — specific model names (Llama-3.1-70B-class, GPT-4o, Claude 3.5 Sonnet, BGE-large-en-v1.5, E5-mistral-7b-instruct) are PRD-prescribed engineering choices and may not reflect actual wealth.com architecture.
