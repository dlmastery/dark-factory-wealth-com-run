/**
 * Tenant-context plugin — binds the request's tenant_id (from JWT) to a
 * Postgres transaction via withTenant. Per ADR-002 layer 2.
 *
 * Provides req.withTenantDb(fn) — handlers MUST use this to access the
 * database. Any handler that calls the raw db pool directly will see
 * RLS-enforced zero rows (the system fails closed).
 */

import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { asTenantId, withTenant, type TenantClient, type TenantId } from "@estatecompass/db";

declare module "fastify" {
  interface FastifyRequest {
    withTenantDb: <T>(fn: (db: TenantClient) => Promise<T>) => Promise<T>;
    tenantId: TenantId | undefined;
  }
}

export default fp(async (app: FastifyInstance) => {
  app.addHook("onRequest", async (req: FastifyRequest, _reply: FastifyReply) => {
    // tenantId resolved later by requireAuth handler; tenant-context is a
    // helper closure that uses whatever auth populated.
    req.withTenantDb = async <T>(fn: (db: TenantClient) => Promise<T>) => {
      if (!req.auth?.tenant_id) {
        throw new Error("tenant_context not initialized; require requireAuth first");
      }
      const tid = asTenantId(req.auth.tenant_id);
      req.tenantId = tid;
      return withTenant(tid, fn);
    };
  });
});
