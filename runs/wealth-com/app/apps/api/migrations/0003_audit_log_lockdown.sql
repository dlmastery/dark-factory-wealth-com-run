-- 0003_audit_log_lockdown.sql — make audit_log append-only.
-- Per ADR-002 + RULE-AUDIT-001 + FINRA Rule 17a-4 alignment.
--
-- The application Postgres role can INSERT and (under RLS) SELECT, but cannot
-- UPDATE or DELETE rows. Tampering with the audit trail requires a separate
-- 'audit_admin' role used only by retention archival jobs.
--
-- Test: tests/migrations/test_audit_log_immutability.sql attempts UPDATE and
-- DELETE as the application role and expects permission-denied / 0 rows.

BEGIN;

-- Create the application role if it doesn't exist; running as a no-op when it does.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'estatecompass_app') THEN
        CREATE ROLE estatecompass_app NOLOGIN;
        COMMENT ON ROLE estatecompass_app IS 'Application role for api service. Non-superuser, RLS-bound, no UPDATE/DELETE on audit_log.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'estatecompass_audit_admin') THEN
        CREATE ROLE estatecompass_audit_admin NOLOGIN;
        COMMENT ON ROLE estatecompass_audit_admin IS 'Privileged role for audit retention archival only. Out-of-band invocation; not used by the api service.';
    END IF;
END$$;

-- Grant minimal privileges on audit_log to the application role
GRANT SELECT, INSERT ON audit_log TO estatecompass_app;
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM estatecompass_app;
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM PUBLIC;

-- audit_admin can do anything (used by retention archival to immutable storage)
GRANT ALL ON audit_log TO estatecompass_audit_admin;

-- Other tables: standard CRUD for application role (RLS confines per-tenant)
GRANT SELECT, INSERT, UPDATE, DELETE ON users, sessions TO estatecompass_app;
GRANT USAGE ON SCHEMA public TO estatecompass_app;

COMMIT;
