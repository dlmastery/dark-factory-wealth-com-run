/**
 * CalcEngineClient — typed HTTP client for the deterministic calc-engine.
 *
 * Per ADR-001: the api MUST NOT do tax/estate arithmetic itself. Every
 * monetary computation flows through this client to the calc-engine, which
 * is the single source of correctness.
 *
 * The api is the audit boundary: it persists ComputationTrace rows referencing
 * each calc invocation so the WORM audit log captures the full chain
 * advisor-action → calc-engine-rule → output.
 */

import { z } from "zod";

const FederalEstateTaxResponseSchema = z.object({
  rule_id: z.string(),
  citation: z.string(),
  computation_version: z.string(),
  inputs: z.record(z.string()),
  adjusted_gross_estate: z.string(),
  available_exemption: z.string(),
  taxable_estate: z.string(),
  federal_estate_tax: z.string(),
  breakdown: z.record(z.string()),
});
export type FederalEstateTaxResponse = z.infer<typeof FederalEstateTaxResponseSchema>;

export interface FederalEstateTaxRequest {
  gross_estate: string;
  funeral_admin_expenses?: string;
  debts?: string;
  marital_deduction?: string;
  charitable_deduction?: string;
  dsue_amount?: string;
}

const GRATScenarioResponseSchema = z.object({
  scenario_id: z.string(),
  inputs_snapshot: z.unknown(),
  grat_path: z.object({
    name: z.string(),
    gross_estate_at_term: z.string(),
    federal_estate_tax: z.string(),
    transferred_to_beneficiaries_outside_estate: z.string(),
    net_to_beneficiaries: z.string(),
  }),
  do_nothing_path: z.object({
    name: z.string(),
    gross_estate_at_term: z.string(),
    federal_estate_tax: z.string(),
    transferred_to_beneficiaries_outside_estate: z.string(),
    net_to_beneficiaries: z.string(),
  }),
  tax_savings: z.string(),
  additional_to_beneficiaries: z.string(),
  grat_failed: z.boolean(),
  notes: z.array(z.string()),
});
export type GRATScenarioResponse = z.infer<typeof GRATScenarioResponseSchema>;

export interface GRATScenarioRequest {
  total_estate_at_year_zero: string;
  grat_principal: string;
  section_7520_rate: string;
  projected_growth_rate: string;
  term_years: number;
  dsue_amount?: string;
}

export class CalcEngineError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly upstreamBody?: string,
  ) {
    super(message);
    this.name = "CalcEngineError";
  }
}

export class CalcEngineClient {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async federalEstateTax(req: FederalEstateTaxRequest): Promise<FederalEstateTaxResponse> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/calc/federal-estate-tax`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new CalcEngineError(
        `calc-engine returned ${response.status}`,
        response.status,
        text,
      );
    }
    return FederalEstateTaxResponseSchema.parse(JSON.parse(text));
  }

  async gratVsDoNothing(req: GRATScenarioRequest): Promise<GRATScenarioResponse> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/calc/scenario/grat-vs-donothing`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new CalcEngineError(
        `calc-engine returned ${response.status}`,
        response.status,
        text,
      );
    }
    return GRATScenarioResponseSchema.parse(JSON.parse(text));
  }
}
