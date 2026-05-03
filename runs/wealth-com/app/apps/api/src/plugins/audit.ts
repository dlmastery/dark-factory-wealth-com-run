/**
 * Audit-log plugin — RULE-AUDIT-001.
 *
 * Every authenticated request emits one audit_log row at request-end. The
 * row is INSERTed via the application Postgres role, which has been REVOKEd
 * UPDATE/DELETE permissions on audit_log (migration 0003) — so the entry is
 * append-only at the database layer.
 */

import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default fp(async (app: FastifyInstance) => {
  app.addHook("onResponse", async (req: FastifyRequest, reply: FastifyReply) => {
    const auth = req.auth;
    if (!auth) return; // unauthenticated requests are not audited at the user level

    try {
      await req.withTenantDb(async (db) => {
        await db.query(
          `INSERT INTO audit_log
              (tenant_id, user_id, action, resource_type, resource_id, detail, ip, user_agent)
           VALUES ($1, $2, $3, $4, NULL, $5::jsonb, $6, $7)`,
          [
            auth.tenant_id,
            auth.sub,
            `${req.method} ${req.routerPath ?? req.url}`,
            req.routerPath ?? req.url,
            JSON.stringify({
              status_code: reply.statusCode,
              elapsed_ms: reply.elapsedTime,
            }),
            req.ip,
            req.headers["user-agent"] ?? null,
          ],
        );
      });
    } catch (err) {
      // Never fail the response on audit failure — but log loudly.
      req.log.error({ err }, "audit_log insert failed");
    }
  });
});
