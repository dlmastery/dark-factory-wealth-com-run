/**
 * Household routes — Slice-2 surface served via Fastify.
 *
 * Per ADR-002: tenant isolation is enforced by RLS at Postgres level; these
 * handlers do NOT add manual WHERE tenant_id clauses. RLS makes every query
 * tenant-scoped by virtue of withTenantDb.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function householdRoutes(app: FastifyInstance) {
  app.get(
    "/v1/households",
    { preHandler: app.requireAuth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const rows = await req.withTenantDb(async (db) => {
        const { rows } = await db.query<{
          id: string;
          display_name: string;
          primary_residence_state: string | null;
          created_at: Date;
        }>(
          `SELECT id, display_name, primary_residence_state, created_at
             FROM households
            WHERE archived_at IS NULL
            ORDER BY created_at DESC`,
        );
        return rows;
      });
      return reply.send({ households: rows, count: rows.length });
    },
  );

  app.get(
    "/v1/households/:id",
    { preHandler: app.requireAuth },
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const id = req.params.id;
      const result = await req.withTenantDb(async (db) => {
        const householdResult = await db.query<{
          id: string;
          display_name: string;
          primary_residence_state: string | null;
          notes: string | null;
        }>(
          `SELECT id, display_name, primary_residence_state, notes
             FROM households WHERE id = $1 AND archived_at IS NULL`,
          [id],
        );
        const household = householdResult.rows[0];
        if (!household) return null;

        const persons = await db.query(
          `SELECT id, full_name, date_of_birth, relationship_to_primary, is_us_citizen, deceased
             FROM persons WHERE household_id = $1 ORDER BY date_of_birth`,
          [id],
        );
        const entities = await db.query(
          `SELECT id, name, entity_type, jurisdiction, created_on
             FROM entities WHERE household_id = $1`,
          [id],
        );
        const assets = await db.query(
          `SELECT id, asset_class, description, fair_market_value, cost_basis, entity_id
             FROM assets WHERE household_id = $1 ORDER BY fair_market_value DESC`,
          [id],
        );
        const totalAssets = await db.query<{ total: string }>(
          `SELECT COALESCE(SUM(fair_market_value), 0)::text AS total
             FROM assets WHERE household_id = $1`,
          [id],
        );

        return {
          household,
          persons: persons.rows,
          entities: entities.rows,
          assets: assets.rows,
          gross_estate: totalAssets.rows[0]?.total ?? "0",
        };
      });

      if (!result) return reply.code(404).send({ error: "not_found" });
      return reply.send(result);
    },
  );
}
