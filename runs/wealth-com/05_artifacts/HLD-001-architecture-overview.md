# HLD-001 · High-Level Design — EstateCompass Demo MVP

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Standards basis:** ISO/IEC/IEEE 42010:2022 (architecture description); C4 model; OMG MDA (PIM/PSM separation)
**Companions:** ADR-001/002/003, DDD-001 glossary, GOV-001 charter, spec-decomposition-record.json

## 1. Architecture in one paragraph

EstateCompass is a multi-tenant, document-intelligence SaaS where advisors upload estate documents, an AI service (Sage) extracts structured facts with citation grounding, a deterministic calc-engine computes federal estate tax under OBBBA, and a scenario service compares strategies (Demo MVP: GRAT vs do-nothing). Three independent layers enforce tenant isolation: Postgres RLS, a connection-pool wrapper enforcing `SET LOCAL app.tenant_id`, and per-tenant KMS data keys. AI hallucination is contained by architectural separation (LLM never does math) plus a grounding validator that requires verbatim source-excerpt matching for every emitted fact. The system is locally-runnable via Docker Compose; production deployment is out of scope at v0.

## 2. C4 — System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                     Advisor (browser, desktop)                   │
└──────────────────────────────────┬──────────────────────────────┘
                                   │ HTTPS
┌──────────────────────────────────┴──────────────────────────────┐
│                        EstateCompass System                      │
│                                                                  │
│   ┌──────────┐    ┌──────────┐   ┌──────────────┐  ┌──────────┐ │
│   │   Web    │───▶│   API    │──▶│ AI Extract   │  │  Calc    │ │
│   │  (Vite)  │    │ (Fastify)│   │   (Sage)     │  │ Engine   │ │
│   └──────────┘    └────┬─────┘   └───────┬──────┘  └────┬─────┘ │
│                         │                 │              │       │
│                         ▼                 ▼              ▼       │
│                   ┌──────────────────────────────────────────┐   │
│                   │         Postgres 16 (RLS-enforced)       │   │
│                   │    + per-tenant KMS data keys (KMS-sub)  │   │
│                   │    + WORM audit_log (REVOKE UPDATE/DEL)  │   │
│                   └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  External: Anthropic Claude (LLM provider for Sage extraction)   │
│  External: Plaid-shape mock + Schwab-shape mock (Slice-8)        │
└──────────────────────────────────────────────────────────────────┘
```

## 3. C4 — Container view

| Container | Tech | Responsibility | Port (local) |
|---|---|---|---|
| `web` | React 18 + Vite + Tailwind + Tanstack Query | Advisor UI; calls API only; never talks to AI/calc directly | 5173 |
| `api` | Node 20 + TS + Fastify + Pino | Auth/RBAC, tenant_context binding, request routing, audit-log writes, orchestration of ai-extract + calc-engine | 3000 |
| `ai-extract` | Python 3.12 + FastAPI + Anthropic SDK | Sage extractor; layout-aware OCR mock + LLM grounded extraction + grounding validator | 8000 |
| `calc-engine` | Python 3.12 + FastAPI | Pure deterministic calc functions (federal estate tax under OBBBA, GRAT remainder valuation); golden-dataset tested | 8001 |
| `postgres` | Postgres 16-alpine | Sole datastore; RLS-enforced; pgvector for embeddings (Slice-4 RAG); WORM audit_log | 5432 |
| `otel-collector` | OpenTelemetry Contrib | Traces + metrics aggregation across containers (deferred-detail at v0) | 4318 |

## 4. Bounded contexts (DDD)

Per `DDD-001` glossary; full context map in DDD-002 (forthcoming).

1. **Identity & Tenancy** — User, Tenant, Role, Session, Audit. Owned by api. Anti-corruption against external SSO providers (out-of-scope at v0; SSO-stub).
2. **Household** — Household, Person, Entity (Trust types), Role assignments. Owned by api. Aggregate root: Household.
3. **Document Vault** — Document, DocumentType, ExtractedFact, GroundingValidator results. Co-owned by api (storage/audit) and ai-extract (extraction).
4. **Estate Tax & Calculations** — CalcRule, GoldenDatasetCase, ComputationTrace. Owned by calc-engine.
5. **Scenarios** — ScenarioRun, ScenarioComparison. Owned by api (orchestration) + calc-engine (math).
6. **Audit & Compliance (cross-cutting)** — WORMAuditEntry, complianceConfig. Cross-context discipline.
7. **Integration Adapters (Slice-8)** — PlaidShapeAdapter, SchwabShapeAdapter. Anti-corruption layers.

## 5. Component-level decomposition (per slice)

### Slice 1 — Auth + Tenant + Identity

```
api/
├── src/
│   ├── plugins/
│   │   ├── auth.ts              # JWT + RBAC; calls IdentityService
│   │   ├── tenant-context.ts    # SET LOCAL app.tenant_id from JWT claim
│   │   └── audit.ts             # writes WORMAuditEntry per request
│   ├── services/
│   │   └── identity.service.ts  # User, Tenant, Role CRUD
│   ├── routes/
│   │   ├── auth.routes.ts       # POST /v1/auth/login, /refresh, /logout
│   │   └── me.routes.ts         # GET /v1/me
│   └── server.ts
├── migrations/
│   ├── 0001_init.sql            # tenant + user + role + session tables
│   ├── 0002_rls_policies.sql    # RLS for tenant-scoped tables
│   └── 0003_audit_log.sql       # WORM audit_log + REVOKE UPDATE/DELETE
└── tests/
    ├── unit/                    # service-level unit tests
    └── integration/
        ├── tenant-isolation.test.ts  # cross-tenant SELECT must return 0 rows
        ├── rls-coverage.test.ts      # every tenant-scoped table has policy
        └── audit-immutability.test.ts # UPDATE/DELETE on audit_log fails
```

### Slice 2 — Household Model

```
api/
├── migrations/
│   ├── 0004_households.sql      # household + person + entity + role tables (RLS on)
│   └── 0005_seed_demo.sql       # synthetic data (per HD-008)
├── src/
│   ├── domain/
│   │   ├── household.ts         # aggregate root types (DDD)
│   │   ├── person.ts
│   │   └── entity.ts            # Trust subtypes
│   ├── services/
│   │   └── household.service.ts
│   └── routes/
│       └── households.routes.ts
└── tests/
    ├── unit/                    # entity invariants
    └── integration/             # CRUD with tenant isolation
```

### Slice 3 — Document Vault

```
api/migrations/0006_documents.sql                # document + extracted_fact tables
api/src/services/document.service.ts             # upload, encrypt with per-tenant DEK
api/src/services/kms.service.ts                  # KMS substitute (file-backed at v0)
ai-extract/                                       # served separately
└── tests/integration/encryption-roundtrip.test.ts
```

### Slice 4 — Sage Extraction

```
ai-extract/
├── app/
│   ├── main.py                  # FastAPI; POST /v1/extract
│   ├── extractors/
│   │   ├── claude_grounded.py   # Anthropic Claude with structured-output schema
│   │   └── ocr_mock.py          # layout-aware OCR mock (PDF text + bbox heuristics)
│   ├── validators/
│   │   └── grounding.py         # MUST grep source_excerpt in document; downgrade if fail
│   └── eval/
│       ├── holdout/             # public-corpus wills/trusts (sourced in OQ-INTAKE-005)
│       └── eval_harness.py      # F1 + refusal honesty + calibration
└── tests/
    ├── unit/
    └── integration/
        ├── grounding-rejects-ungrounded.test.py
        ├── refusal-honesty.test.py    # missing fact → requires_human_review, NOT hallucinated
        └── attorney-review-routing.test.py
```

### Slice 5 — Estate Tax Calc Engine

```
calc-engine/
├── app/
│   ├── main.py                  # FastAPI; POST /v1/calc/federal-estate-tax
│   ├── rules/
│   │   ├── federal_estate_tax_obbba.py   # RULE-FET-OBBBA-2026
│   │   ├── dsue_portability.py           # RULE-DSUE-2026
│   │   └── grat_remainder_7520.py         # RULE-GRAT-7520-2026
│   └── traces/
│       └── computation_trace.py # writes ComputationTrace to api via callback
└── tests/
    ├── unit/
    └── golden/
        ├── obbba_baseline.json   # ≥20 cases (DOD-3)
        ├── dsue_cases.json
        └── grat_cases.json
```

### Slice 6 — Scenario Builder (narrowed to GRAT vs do-nothing)

```
api/src/services/scenario.service.ts    # orchestrates calc-engine calls
api/src/routes/scenarios.routes.ts       # POST /v1/scenarios/grat-vs-donothing
api/tests/integration/scenario-grat.test.ts  # uses synthetic $20M household
```

### Slice 8 — Integration mocks (2 only per CC-001)

```
api/src/integrations/
├── plaid_shape/
│   ├── adapter.ts                # anti-corruption layer
│   ├── contract.json             # captured Plaid response shape
│   └── mock_server.ts            # local HTTP server replaying recorded responses
└── schwab_shape/
    └── (same pattern)
```

### Slice 9 — Advisor UI

```
web/
├── src/
│   ├── pages/
│   │   ├── login.tsx
│   │   ├── dashboard.tsx
│   │   ├── households/
│   │   │   ├── list.tsx
│   │   │   └── [id]/index.tsx
│   │   ├── documents/upload.tsx
│   │   ├── extraction/[docId].tsx
│   │   ├── tax-baseline.tsx
│   │   └── scenarios/grat.tsx
│   ├── components/
│   │   ├── EvidenceBadge.tsx     # confidence tier + provenance hover
│   │   └── Disclaimer.tsx        # FR-UI-DISCLAIMER-001 on every screen
│   └── ci/
│       └── check-no-marks.ts     # brand-substitution CI gate
└── e2e/
    ├── full-walkthrough.spec.ts  # Playwright; the canonical demo path
    └── cross-tenant-cant-see.spec.ts  # bypass attempt fails
```

## 6. Cross-cutting concerns

### Tenant isolation (ADR-002)
Three layers (RLS + connection-pool + KMS) — see ADR-002.

### AI grounding (ADR-003)
JSON Schema enforcement + grounding validator + confidence tiers + refusal honesty — see ADR-003.

### Deterministic calc (ADR-001)
LLM never does arithmetic — see ADR-001.

### Audit log (RULE-AUDIT-001)
Every authenticated request writes a WORMAuditEntry. The `audit_log` table has REVOKE UPDATE/DELETE on the application Postgres role; only a separate "audit_admin" role (used for retention archival to immutable storage) can write outside append. Retention 7 years aligned with FINRA Rule 17a-4.

### UPL discipline (HD-007 + ADR-003)
- No drafting endpoints in v0 (Document Creation surface deferred per CC-001).
- `Disclaimer` component renders on every advisor-facing screen.
- `attorney_review_required: true` field set on extraction tags routes facts to a review queue.

### Synthetic data only (HD-008)
- Seed data (Slice-2 migration `0005_seed_demo.sql`) is synthetic.
- E2E tests use synthetic fixtures.
- A pre-commit hook rejects strings matching `\d{3}-\d{2}-\d{4}` (SSN pattern) outside test fixtures (advisory; full DLP out of v0 scope).

### Brand substitution (HD-002)
CI gate `apps/web/ci/check-no-marks.ts` — see DDD-001 §Forbidden terms.

### Observability
- Structured logging via Pino (api) and structlog (Python services).
- OTel traces across api → ai-extract → calc-engine.
- Metrics: request latency p95, extraction confidence distribution, calc-engine rule invocation count, audit-log write rate.
- v0 keeps the otel-collector as a passthrough (no backend); production posture would forward to a real backend.

## 7. Data model (top-level)

Postgres tables (all tenant-scoped have `tenant_id UUID NOT NULL` + RLS policy):

- `tenants` (no tenant_id; bootstrap)
- `users` — has `tenant_id`
- `roles` — `(user_id, household_id, role_type)`
- `households` — has `tenant_id`
- `persons` — has `tenant_id`, `household_id`
- `entities` — has `tenant_id`, `household_id`, `entity_type` (TRUST_REVOCABLE | TRUST_GRAT | TRUST_DYNASTY | LLC | OTHER)
- `assets` — has `tenant_id`, `household_id`, `entity_id?`
- `documents` — has `tenant_id`, `household_id`; `encrypted_with_dek_id`
- `tenant_kms_keys` — `(tenant_id, kek_ref, created_at, rotated_at)`
- `document_deks` — per-document DEK encrypted with tenant KEK
- `extracted_facts` — has `tenant_id`, `document_id`, full provenance + confidence
- `computation_traces` — has `tenant_id`, `rule_id`, inputs, output, citation
- `scenario_runs` — has `tenant_id`, household_id, scenario_type
- `audit_log` — append-only; REVOKE UPDATE/DELETE on app role

Indexes: every tenant-scoped table indexes `(tenant_id, ...)` with tenant_id as the leading column for RLS performance.

## 8. API surface (top-level; OpenAPI in `packages/contracts/openapi.yaml` Slice-1)

- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/me`
- `GET /v1/households`
- `GET /v1/households/{id}`
- `POST /v1/households/{id}/documents` (multipart upload)
- `POST /v1/documents/{id}/extract` → triggers Sage; returns extraction_run_id
- `GET /v1/documents/{id}/facts` → list ExtractedFact with provenance
- `PATCH /v1/documents/{id}/facts/{fact_id}` → advisor accepts/edits/rejects (writes audit)
- `GET /v1/households/{id}/tax-baseline` → calls calc-engine; returns TaxableEstate breakdown
- `POST /v1/households/{id}/scenarios/grat-vs-donothing` → ScenarioComparison
- `GET /v1/audit-log?tenant_id=…` (admin-only; tenant-scoped)

## 9. Non-functional posture (per intake NFRs)

| NFR | Target | Notes |
|---|---|---|
| API p95 latency | < 300ms (excluding ai-extract / calc-engine) | Local Docker; production posture would tighten |
| Sage extraction throughput | 1 doc / 60s reasonable for v0 | Async; UI shows progress |
| Calc-engine response | < 100ms p95 | Pure functions; in-memory |
| Web initial load | < 2s | Vite + lean dependencies |
| Tenant isolation | 100% pass on cross-tenant attack tests | Hawkeye recurring |
| Extraction grounding | 100% facts have grep-verifiable source_excerpt | ADR-003 validator |
| Calc accuracy | 100% golden dataset pass | DOD-3 |
| WCAG 2.1 AA | Pass on demo flow | Playwright + axe |
| Visual regression | Baseline + diff on demo flow | Slice-9 |

## 10. Risks & mitigations (links to GOV-001)

- RSK-001: ADR-001 + ADR-003 + holdout
- RSK-002: golden dataset + deterministic engine
- RSK-003: HD-007 + Disclaimer component + attorney_review_required routing
- RSK-004: ADR-002 three layers
- RSK-005: anti-overfit + transfer test
- Performance and scale risks: scoped to single-user demo per WAIVER-002

## 11. Decisions deferred to LLDs

- Specific JWT library + key-rotation policy → LLD-AUTH
- Postgres connection-pool library + transaction-context interaction → LLD-DB
- ai-extract chunking strategy + RAG vector store → LLD-EXTRACT
- Scenario projection time-step + display formatting → LLD-SCENARIO
- React component library (shadcn/ui considered; final decision in LLD-UI)
- Pre-commit + CI tooling → LLD-CI

## 12. Threat model summary (full in ARC-005)

Top 5 STRIDE threats addressed at HLD level:

1. **Spoofing** — JWT validated on every request; tenant_id claim signed; key rotation supported.
2. **Tampering** — RLS makes cross-tenant SELECT physically impossible; audit_log REVOKE prevents modification.
3. **Repudiation** — every authenticated action emits a WORMAuditEntry with actor + timestamp + IP.
4. **Information disclosure** — three-layer tenant isolation + per-tenant KMS DEKs; AI extraction grounding prevents document content leak via hallucination.
5. **Elevation of privilege** — RBAC roles checked at handler level; admin endpoints require explicit admin role; JWT cannot self-elevate.

LINDDUN privacy threats: covered in ARC-005 separate section (forthcoming).

## 13. Build & deploy (v0 only)

`docker compose up --build` from `runs/wealth-com/app/`. Production posture (multi-region AWS, KMS proper, CI/CD) is out of scope per HD-004; ADR-005 (release) and REL-001 (release plan) are deferred.

## 14. Trace links

- Source: ATTR-WEALTHCOM-001, GOV-001, CC-001, ENG-GOV-WEALTHCOM-001
- Source: spec-decomposition-record.json (97 leaves drive components)
- Source: domain-brief.md (extract→compute→narrate canonical pattern)
- Implements: ADR-001, ADR-002, ADR-003, HD-002 brand, HD-007 UPL, HD-008 synthetic
- Refines-into: LLD-AUTH, LLD-DB, LLD-EXTRACT, LLD-CALC, LLD-SCENARIO, LLD-UI, LLD-CI (Stage-4 children)
- Verified-by: Slice-1..9 RALPH loops + Hawkeye recurring + transfer test
