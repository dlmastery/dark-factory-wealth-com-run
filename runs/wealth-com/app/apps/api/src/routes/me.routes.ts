/**
 * GET /v1/me — current authenticated user. Demonstrates withTenantDb usage.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function meRoutes(app: FastifyInstance) {
  app.get(
    "/v1/me",
    { preHandler: app.requireAuth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = await req.withTenantDb(async (db) => {
        const { rows } = await db.query<{
          id: string;
          email: string;
          full_name: string;
          role: string;
          last_login_at: Date | null;
        }>(
          "SELECT id, email, full_name, role, last_login_at FROM users WHERE id = $1",
          [req.auth!.sub],
        );
        return rows[0];
      });
      if (!result) return reply.code(404).send({ error: "not_found" });
      return reply.send(result);
    },
  );
}
