-- 0002_rls_policies.sql — Row-Level Security per ADR-002 layer 1.
--
-- The application Postgres role (e.g., 'estatecompass_app') runs as NON-superuser.
-- Every tenant-scoped table has RLS enabled and a policy that constrains rows by
-- the session-local 'app.tenant_id' setting. The connection-pool wrapper in
-- packages/db sets this via SET LOCAL app.tenant_id = '<uuid>' at the start of
-- every transaction. No tenant_id set => no rows visible.
--
-- Migration test 0002_rls_test.sql (in tests/migrations/) verifies that every
-- table containing tenant_id has both RLS enabled AND a policy named *_tenant_isolation.

BEGIN;

-- Helper: extract the current tenant from session GUC.
-- Returns NULL when not set, which makes USING () return false → zero rows.
CREATE OR REPLACE FUNCTION app_current_tenant() RETURNS UUID
LANGUAGE SQL STABLE AS $$
    SELECT NULLIF(current_setting('app.tenant_id', TRUE), '')::UUID
$$;

COMMENT ON FUNCTION app_current_tenant IS 'Returns the tenant_id set on the current session via SET LOCAL app.tenant_id. NULL when unset; RLS policies treat NULL as "no rows".';

-- USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;            -- applies to table owner too
CREATE POLICY users_tenant_isolation ON users
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- SESSIONS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions FORCE ROW LEVEL SECURITY;
CREATE POLICY sessions_tenant_isolation ON sessions
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- AUDIT LOG — read is tenant-scoped; write must NOT bypass.
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_log_tenant_isolation ON audit_log
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- Note: tenants table is intentionally NOT under RLS — it is the bootstrap
-- root. The application role does NOT receive SELECT on tenants; only the
-- bootstrap/admin role does. End-user requests never read tenants directly;
-- they receive their tenant_id from the JWT claim.

REVOKE SELECT, INSERT, UPDATE, DELETE ON tenants FROM PUBLIC;
-- The application role gets nothing on tenants. Provisioning happens out of band.

COMMIT;
