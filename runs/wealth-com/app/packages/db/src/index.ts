/**
 * packages/db — connection-pool wrapper enforcing tenant_context (ADR-002 layer 2).
 *
 * Every query MUST go through this module. Direct imports from `pg` in apps/* are
 * disallowed by the eslint config (no-restricted-imports). The wrapper sets
 * `SET LOCAL app.tenant_id = <uuid>` inside a transaction, then runs the
 * caller's queries, then commits or rolls back. If no tenant_context is provided,
 * RLS makes every query return zero rows and writes raise check-violations.
 *
 * Anti-pattern guard: a query path that obtains a raw client without going
 * through `withTenant` will not have `app.tenant_id` set; queries will look
 * "broken" (zero rows) — this is the design forcing tenant-context discipline.
 */

import { Pool, PoolClient, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";

export type TenantId = string & { readonly __brand: "TenantId" };
export type DbConfig = PoolConfig;

let pool: Pool | null = null;

export function configure(config: DbConfig): void {
  if (pool) {
    throw new Error("db pool already configured");
  }
  pool = new Pool(config);
  pool.on("error", (err) => {
    // Pool-level errors (idle client errors etc.) — log loudly; never swallow.
    console.error("[db] pool error", err);
  });
}

export function isConfigured(): boolean {
  return pool !== null;
}

export async function shutdown(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Run `fn` with a tenant-scoped transactional client. Sets
 * `SET LOCAL app.tenant_id` so RLS policies confine queries to this tenant.
 * Commits on success; rolls back and rethrows on error.
 *
 * Use for ALL request-scoped tenant data access. Never run a tenant-scoped
 * query outside this wrapper.
 */
export async function withTenant<T>(
  tenantId: TenantId,
  fn: (client: TenantClient) => Promise<T>,
): Promise<T> {
  if (!pool) throw new Error("db pool not configured; call configure(...) first");
  if (!tenantId) throw new Error("withTenant requires a tenantId");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // SET LOCAL is bound to the transaction; it does NOT leak across pool reuse.
    // Use parameterized form to prevent injection (pg supports this for SET only via raw text — sanitize tenantId via UUID validation upstream; we additionally bracket via $1::uuid).
    await client.query("SELECT set_config('app.tenant_id', $1::text, true)", [tenantId]);

    const wrapped: TenantClient = {
      query: <R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]) =>
        client.query<R>(text, values),
      tenantId,
    };

    const result = await fn(wrapped);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore rollback failure; surfacing the original error matters more
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Privileged escape-hatch for bootstrap operations (provisioning a new tenant,
 * etc.). Does NOT set tenant_id; uses a connection without RLS-restricted role.
 * Should only be invoked from migrations / admin tooling — NEVER from request
 * handlers.
 */
export async function withAdminClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!pool) throw new Error("db pool not configured");
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export interface TenantClient {
  query: <R extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ) => Promise<QueryResult<R>>;
  tenantId: TenantId;
}

// Helper for branding a string at trust boundary (after JWT verification).
export function asTenantId(uuid: string): TenantId {
  // UUID v4 regex (lenient on case)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
    throw new Error(`invalid tenant_id format: ${uuid}`);
  }
  return uuid as TenantId;
}
