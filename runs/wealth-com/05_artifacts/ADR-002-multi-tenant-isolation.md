# ADR-002 · Multi-Tenant Isolation via Postgres RLS + Per-Tenant KMS

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Decision-makers:** Architecture persona + Security Juror + Data Domain Juror + Adversarial Prosecutor
**Supersedes:** none

## Context

The Demo MVP is a multi-tenant fintech SaaS holding wealth, family, and document data for advisor firms. RSK-004 (multi-tenant data leak) is rated severity:high. Tenant boundary violation = front-page headline.

Tenants:
- An *advisor firm* (e.g., "Acme RIA") is a tenant.
- Within a tenant, *advisors* authenticate with RBAC roles (admin, advisor, paraplanner, read-only).
- Within a tenant, *households* are the primary aggregate. Households contain people, entities (trusts), assets, documents.
- *End-clients* (HNW individuals/families) are not v0 users — advisor-only UI per CC-001.

Sensitive data:
- PII: SSN, DOB, address, phone (per PRD)
- PHI: Advance Health Care Directive content
- Financial detail: asset inventories, beneficiary designations
- Legal detail: trust mechanics, distribution rules

Compliance baseline:
- GLBA (financial data safeguards rule)
- HIPAA (BAA boundary; v0 synthetic only per HD-008, but architecture must support)
- CCPA/CPRA (CA tenants)
- NYDFS Part 500 (NY tenants — universal MFA + asset inventory program effective Nov 2025)
- SOC 2 Type II posture (controls designed; audit out of scope)

Forces:
- Application-level filtering (`WHERE tenant_id = ?`) is **necessary but insufficient** — one missing WHERE clause = breach.
- Kubernetes namespacing or per-tenant Postgres instances would be safer but operationally infeasible at v0 scale.
- ABAC (asset_value > $10M → restricted UI) is a v2 concern; v0 RBAC is enough.
- Per-tenant encryption key gives "crypto-shred" capability when a tenant offboards.

## Decision

**Tenant isolation is enforced at three layers, with no single point of failure:**

### Layer 1 — Postgres Row-Level Security (RLS)
- Every table holding tenant data has a `tenant_id UUID NOT NULL` column.
- An RLS policy is enabled on every such table:
  ```sql
  CREATE POLICY tenant_isolation ON <table>
    USING (tenant_id = current_setting('app.tenant_id')::uuid);
  ```
- The application sets `app.tenant_id` on every request via `SET LOCAL app.tenant_id = $1` inside the transaction.
- Database role for the application is NON-superuser (cannot bypass RLS).
- Migrations include both the column AND the policy; a migration that adds a tenant table without RLS is rejected by `migrations/test_rls_complete.sql`.

### Layer 2 — Connection-pool tenant binding
- Connection-pool wrapper (`packages/db/`) requires every query to specify a `tenant_context`. Pool implementation runs `SET LOCAL app.tenant_id` before the query and clears it after.
- Any code path that obtains a raw connection without going through the wrapper trips an ESLint rule (`no-restricted-imports` on `pg` direct).
- Integration test: open a connection, attempt a SELECT with no tenant context set → must error or return zero rows.

### Layer 3 — Per-tenant KMS data key
- `tenant_kms_key` table maps `tenant_id` → KMS key reference (in v0, a local KMS-substitute; in production posture, AWS KMS or equivalent).
- PII/PHI columns (SSN, DOB, address, document content) use envelope encryption: data encrypted with a per-document DEK; DEK encrypted with the per-tenant KEK.
- Key rotation is per-tenant. Tenant offboarding = delete the KEK = crypto-shred all that tenant's data.

### Audit log
- Every authenticated request emits a row to `audit_log` with `(timestamp, tenant_id, user_id, action, resource_type, resource_id, ip, user_agent)`.
- The audit_log table is **append-only**: REVOKE UPDATE, DELETE on the application role.
- WORM discipline: rows older than retention threshold are moved to immutable storage (S3 Object Lock or equivalent at production posture; local equivalent at v0).
- Audit log itself is tenant-scoped: a tenant admin can read only their tenant's events.

## Consequences

### Positive
- **Defense-in-depth.** Three independent layers (RLS + connection-pool + KMS) require three failures to cause a leak.
- **Postgres-native.** RLS doesn't require ORM cooperation; works with raw SQL, Prisma, Drizzle, etc.
- **Crypto-shred.** Tenant offboarding has a clean cryptographic answer.
- **Audit log is tamper-evident** by virtue of REVOKE + WORM.

### Negative / Cost
- **Connection-pool wrapper required everywhere.** Onboarding cost; backfill via lint rules.
- **RLS performance.** Adds a predicate to every query. Mitigated by indexes including `tenant_id` as the leading column.
- **Migration rigor.** Every table-creating migration must include both the column AND the policy; tested by `test_rls_complete.sql`.
- **Cross-tenant queries are intentionally hard.** Aggregated analytics across tenants require a separate read path with explicit superuser-context (not used in v0).

### Refusal rules locked
- Refuse to merge a migration that adds a tenant table without RLS policy.
- Refuse to merge code that obtains a raw `pg.Pool` connection without going through `packages/db/`.
- Refuse to accept a tenant-bypass test that returns more rows than the query's tenant_context allows.

## Alternatives considered

### Alt-A: Application-only filtering (rejected)
`WHERE tenant_id = $1` in every query. One missed WHERE = full leak. Rejected.

### Alt-B: Per-tenant database (rejected for v0; reconsider at scale)
Strongest isolation but operationally heavy at v0. Postgres-on-Postgres-instance-on-Postgres-cluster overhead. Reconsider when first tenant requires it for compliance reasons.

### Alt-C: Schema-per-tenant (rejected)
Postgres schema isolation. Better than Alt-A, weaker than Alt-B. Migrations become per-tenant (operational pain). RLS gives equivalent guarantees with less ops cost.

### Alt-D: Skip per-tenant KMS in v0 (rejected — posture matters)
v0 uses synthetic data, but posture matters. Building the per-tenant KEK pattern now means production migration is configuration, not refactor.

## Verification

- **RLS coverage test:** `migrations/test_rls_complete.sql` enumerates every table and asserts a tenant policy exists.
- **Connection-pool test:** Slice-1 integration test attempts a raw pg connection — expects ESLint failure at build time.
- **Tenant-bypass attack test:** Slice-1 + recurring Hawkeye attack — for tenant A user, SELECT * FROM households (no WHERE). Expects: zero rows from any other tenant.
- **Audit-log immutability test:** UPDATE / DELETE on audit_log rows from application role → expect permission denied.
- **Crypto-shred test:** delete tenant KEK, attempt to decrypt one of the tenant's documents → expect failure.
- **OWASP test:** IDOR by ID-guessing across tenants. Expects 404, not 403 (don't leak existence).

## Trace links

- Source: ATTR-WEALTHCOM-001 §risks RSK-004
- Source: PRODUCT-TAILORING-WEALTHCOM-001 §risk_profile.security + .privacy + .compliance
- Source: GENERATED-META-SKILL-WEALTHCOM-001 §runtime_gates.tenant_isolation_validator
- Source: domain-brief.md §9 (NYDFS Part 500, GLBA)
- Mitigates: RSK-004
- Implemented-by: `packages/db/`, `apps/api/migrations/`, `apps/api/middleware/tenant_context.ts` (forthcoming Slice-1)
- Verified-by: Slice-1 RALPH + recurring Hawkeye tenant-bypass attack
