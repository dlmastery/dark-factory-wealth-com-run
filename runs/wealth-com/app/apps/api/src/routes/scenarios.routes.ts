/**
 * Scenario + tax-baseline routes — bridge to calc-engine.
 *
 *   GET  /v1/households/:id/tax-baseline               federal estate tax under OBBBA
 *   POST /v1/households/:id/scenarios/grat-vs-donothing GRAT vs do-nothing comparison
 *
 * Per ADR-001: api does no math; it gathers inputs from the household
 * aggregate, calls calc-engine, and persists a ComputationTrace.
 */

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CalcEngineClient } from "../clients/calc-engine.client.js";
import { loadConfig } from "../config.js";

const GRATBody = z.object({
  grat_principal: z.string().regex(/^\d+(\.\d+)?$/),
  section_7520_rate: z.string().regex(/^0?\.\d+$/),
  projected_growth_rate: z.string().regex(/^0?\.\d+$/),
  term_years: z.number().int().min(1).max(30),
  dsue_amount: z.string().regex(/^\d+(\.\d+)?$/).optional(),
});

export default async function scenarioRoutes(app: FastifyInstance) {
  const cfg = loadConfig();
  const calc = new CalcEngineClient(cfg.CALC_ENGINE_URL);

  app.get<{ Params: { id: string } }>(
    "/v1/households/:id/tax-baseline",
    { preHandler: app.requireAuth },
    async (req, reply) => {
      const totals = await req.withTenantDb(async (db) => {
        const sumResult = await db.query<{ total: string }>(
          "SELECT COALESCE(SUM(fair_market_value), 0)::text AS total FROM assets WHERE household_id = $1",
          [req.params.id],
        );
        const householdExists = await db.query<{ id: string }>(
          "SELECT id FROM households WHERE id = $1 AND archived_at IS NULL",
          [req.params.id],
        );
        if (householdExists.rows.length === 0) return null;
        return sumResult.rows[0]?.total ?? "0";
      });
      if (totals === null) return reply.code(404).send({ error: "not_found" });

      const calcResult = await calc.federalEstateTax({ gross_estate: totals });

      // Persist a ComputationTrace into audit_log detail (lightweight v0
      // — a dedicated computation_traces table is a future structure).
      await req.withTenantDb(async (db) => {
        await db.query(
          `INSERT INTO audit_log (tenant_id, user_id, action, resource_type, resource_id, detail)
           VALUES ($1, $2, 'calc.federal_estate_tax', 'household', $3, $4::jsonb)`,
          [
            req.auth!.tenant_id,
            req.auth!.sub,
            req.params.id,
            JSON.stringify({
              rule_id: calcResult.rule_id,
              citation: calcResult.citation,
              computation_version: calcResult.computation_version,
              gross_estate: totals,
              federal_estate_tax: calcResult.federal_estate_tax,
            }),
          ],
        );
      });

      return reply.send({
        household_id: req.params.id,
        gross_estate: totals,
        ...calcResult,
      });
    },
  );

  app.post<{ Params: { id: string } }>(
    "/v1/households/:id/scenarios/grat-vs-donothing",
    { preHandler: app.requireAuth },
    async (req, reply) => {
      const parsed = GRATBody.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      const total = await req.withTenantDb(async (db) => {
        const exists = await db.query<{ id: string }>(
          "SELECT id FROM households WHERE id = $1 AND archived_at IS NULL",
          [req.params.id],
        );
        if (exists.rows.length === 0) return null;
        const r = await db.query<{ total: string }>(
          "SELECT COALESCE(SUM(fair_market_value), 0)::text AS total FROM assets WHERE household_id = $1",
          [req.params.id],
        );
        return r.rows[0]?.total ?? "0";
      });
      if (total === null) return reply.code(404).send({ error: "not_found" });

      const { dsue_amount, ...rest } = parsed.data;
      const result = await calc.gratVsDoNothing({
        total_estate_at_year_zero: total,
        ...rest,
        ...(dsue_amount !== undefined ? { dsue_amount } : {}),
      });

      await req.withTenantDb(async (db) => {
        await db.query(
          `INSERT INTO audit_log (tenant_id, user_id, action, resource_type, resource_id, detail)
           VALUES ($1, $2, 'scenario.grat_vs_donothing', 'household', $3, $4::jsonb)`,
          [
            req.auth!.tenant_id,
            req.auth!.sub,
            req.params.id,
            JSON.stringify({
              scenario_id: result.scenario_id,
              tax_savings: result.tax_savings,
              grat_failed: result.grat_failed,
              inputs: parsed.data,
            }),
          ],
        );
      });

      return reply.send(result);
    },
  );
}
