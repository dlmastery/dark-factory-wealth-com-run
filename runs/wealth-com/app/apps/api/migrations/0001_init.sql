-- 0001_init.sql — base tables for tenant + identity (Slice-1)
-- Per ADR-002: every tenant-scoped table has tenant_id UUID NOT NULL and an RLS policy.
-- Per RULE-AUDIT-001 from spec-decomposition: audit_log is append-only.
-- HD-008: synthetic data only at v0; passwords here are placeholder hashes.

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;       -- gen_random_uuid(), crypt(), etc.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- ULID-style generation as needed

-- ----------------------------------------------------------------------------
-- TENANT (the isolation boundary; bootstrap root)
-- ----------------------------------------------------------------------------

CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended', 'offboarded')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Per ADR-002: per-tenant KMS key reference. Local-substitute at v0.
    kek_ref         TEXT NOT NULL,
    rotated_at      TIMESTAMPTZ
);

COMMENT ON TABLE tenants IS 'Top-level tenant boundary. Each row is an advisor firm. tenant_id on other tables is FK→here.';

-- ----------------------------------------------------------------------------
-- USERS (advisors / paraplanners; tenant-scoped)
-- ----------------------------------------------------------------------------

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    email           TEXT NOT NULL,
    password_hash   TEXT NOT NULL,                 -- argon2id; placeholder synthetic only
    full_name       TEXT NOT NULL,
    role            TEXT NOT NULL
                    CHECK (role IN ('admin', 'advisor', 'paraplanner', 'read_only')),
    mfa_enrolled    BOOLEAN NOT NULL DEFAULT FALSE,
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'disabled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ,
    UNIQUE (tenant_id, email)                      -- email unique within tenant
);

CREATE INDEX users_tenant_idx ON users(tenant_id);

-- ----------------------------------------------------------------------------
-- SESSIONS (refresh-token-style; short-lived access tokens are JWTs)
-- ----------------------------------------------------------------------------

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    ip              INET,
    user_agent      TEXT
);

CREATE INDEX sessions_user_idx ON sessions(tenant_id, user_id);
CREATE INDEX sessions_expires_idx ON sessions(expires_at) WHERE revoked_at IS NULL;

-- ----------------------------------------------------------------------------
-- AUDIT LOG (append-only; per RULE-AUDIT-001)
-- ----------------------------------------------------------------------------

CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,                  -- intentionally not FK; tenant deletion must not cascade audit
    user_id         UUID,                           -- nullable for unauthenticated/system events
    action          TEXT NOT NULL,                  -- e.g., 'auth.login', 'household.read', 'document.upload'
    resource_type   TEXT,
    resource_id     UUID,
    detail          JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip              INET,
    user_agent      TEXT,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_log_tenant_time_idx ON audit_log(tenant_id, occurred_at DESC);
CREATE INDEX audit_log_user_time_idx ON audit_log(tenant_id, user_id, occurred_at DESC);
CREATE INDEX audit_log_action_idx ON audit_log(tenant_id, action, occurred_at DESC);

COMMENT ON TABLE audit_log IS 'Append-only audit. UPDATE/DELETE are revoked from the application role in 0003_audit_log_lockdown.sql. Aligned with FINRA 17a-4 + SEC 204-2 books-and-records.';

COMMIT;
