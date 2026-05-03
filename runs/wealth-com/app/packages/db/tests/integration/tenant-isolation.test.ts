/**
 * Slice-1 integration test — tenant isolation must be physically enforced
 * by Postgres RLS, not just by application-level WHERE clauses.
 *
 * Per ADR-002 verification §1: "for tenant A user, SELECT * FROM households
 * (no WHERE). Expects: zero rows from any other tenant."
 *
 * This test is the canonical demonstration of layer 1 (RLS) and layer 2
 * (connection-pool wrapper enforcing SET LOCAL app.tenant_id).
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { asTenantId, configure, shutdown, withAdminClient, withTenant } from "../../src/index.js";

const TEST_DB_URL = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

describe.skipIf(!TEST_DB_URL)("tenant-isolation (RLS layer 1)", () => {
  let tenantA: string;
  let tenantB: string;

  beforeAll(async () => {
    configure({ connectionString: TEST_DB_URL });

    // Provision two tenants and one user in each, via admin client (bypass RLS).
    tenantA = await withAdminClient(async (c) => {
      const { rows } = await c.query<{ id: string }>(
        "INSERT INTO tenants (name, slug, kek_ref) VALUES ('Tenant A', 'tenant-a-test', 'kek-A') RETURNING id",
      );
      return rows[0]!.id;
    });
    tenantB = await withAdminClient(async (c) => {
      const { rows } = await c.query<{ id: string }>(
        "INSERT INTO tenants (name, slug, kek_ref) VALUES ('Tenant B', 'tenant-b-test', 'kek-B') RETURNING id",
      );
      return rows[0]!.id;
    });

    await withAdminClient(async (c) => {
      await c.query(
        "INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, 'a@a.test', 'x', 'Alice', 'advisor'), ($2, 'b@b.test', 'x', 'Bob', 'advisor')",
        [tenantA, tenantB],
      );
    });
  });

  afterAll(async () => {
    await withAdminClient(async (c) => {
      await c.query("DELETE FROM users WHERE tenant_id IN ($1, $2)", [tenantA, tenantB]);
      await c.query("DELETE FROM tenants WHERE id IN ($1, $2)", [tenantA, tenantB]);
    });
    await shutdown();
  });

  it("tenant A sees only tenant A users", async () => {
    const result = await withTenant(asTenantId(tenantA), async (db) => {
      return db.query<{ email: string }>("SELECT email FROM users");
    });
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.email).toBe("a@a.test");
  });

  it("tenant B sees only tenant B users", async () => {
    const result = await withTenant(asTenantId(tenantB), async (db) => {
      return db.query<{ email: string }>("SELECT email FROM users");
    });
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.email).toBe("b@b.test");
  });

  it("inserting a row with foreign tenant_id is blocked by WITH CHECK", async () => {
    await expect(
      withTenant(asTenantId(tenantA), async (db) => {
        return db.query(
          "INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, 'evil@a.test', 'x', 'Mallory', 'advisor')",
          [tenantB], // attempt to write across tenant boundary
        );
      }),
    ).rejects.toThrow(); // RLS WITH CHECK violation
  });

  it("connection without tenant_context returns zero rows (no implicit superuser)", async () => {
    // Bypass the wrapper deliberately (raw pool) — simulating a misuse.
    const raw = new Pool({ connectionString: TEST_DB_URL });
    try {
      const { rows } = await raw.query("SELECT email FROM users");
      // RLS applies to the role; without SET LOCAL app.tenant_id, app_current_tenant() is NULL,
      // which makes the policy USING (tenant_id = NULL) → zero rows.
      expect(rows).toHaveLength(0);
    } finally {
      await raw.end();
    }
  });

  it("audit_log INSERT works under tenant context; UPDATE and DELETE do not", async () => {
    await withTenant(asTenantId(tenantA), async (db) => {
      await db.query(
        "INSERT INTO audit_log (tenant_id, action, detail) VALUES ($1, 'test.event', '{}'::jsonb)",
        [tenantA],
      );
    });

    await expect(
      withTenant(asTenantId(tenantA), async (db) => {
        return db.query("UPDATE audit_log SET action = 'tampered' WHERE tenant_id = $1", [tenantA]);
      }),
    ).rejects.toThrow(); // permission denied — REVOKE UPDATE on application role

    await expect(
      withTenant(asTenantId(tenantA), async (db) => {
        return db.query("DELETE FROM audit_log WHERE tenant_id = $1", [tenantA]);
      }),
    ).rejects.toThrow(); // permission denied — REVOKE DELETE
  });
});
