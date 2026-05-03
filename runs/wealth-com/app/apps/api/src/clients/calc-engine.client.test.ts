/**
 * CalcEngineClient unit tests — mock fetch, no live calc-engine.
 */

import { describe, expect, it, vi } from "vitest";
import { CalcEngineClient, CalcEngineError } from "./calc-engine.client.js";

function mockFetch(response: { status: number; body: unknown }): typeof fetch {
  return vi.fn(async () => {
    return new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: { "content-type": "application/json" },
    }) as unknown as Response;
  }) as unknown as typeof fetch;
}

describe("CalcEngineClient.federalEstateTax", () => {
  it("returns parsed response on 200", async () => {
    const fetcher = mockFetch({
      status: 200,
      body: {
        rule_id: "RULE-FET-OBBBA-2026",
        citation: "IRC §2001",
        computation_version: "2026.05.03-OBBBA-baseline",
        inputs: { gross_estate: "20000000" },
        adjusted_gross_estate: "20000000",
        available_exemption: "15000000",
        taxable_estate: "5000000",
        federal_estate_tax: "2000000.00",
        breakdown: { total_deductions: "0" },
      },
    });
    const client = new CalcEngineClient("http://test", fetcher);
    const result = await client.federalEstateTax({ gross_estate: "20000000" });
    expect(result.federal_estate_tax).toBe("2000000.00");
    expect(result.taxable_estate).toBe("5000000");
  });

  it("throws CalcEngineError on non-2xx", async () => {
    const fetcher = mockFetch({ status: 400, body: { error: "bad input" } });
    const client = new CalcEngineClient("http://test", fetcher);
    await expect(client.federalEstateTax({ gross_estate: "-1" })).rejects.toBeInstanceOf(
      CalcEngineError,
    );
  });

  it("rejects schema mismatch (defends against upstream regressions)", async () => {
    const fetcher = mockFetch({
      status: 200,
      body: { rule_id: "x" }, // missing required fields
    });
    const client = new CalcEngineClient("http://test", fetcher);
    await expect(client.federalEstateTax({ gross_estate: "1" })).rejects.toThrow();
  });
});

describe("CalcEngineClient.gratVsDoNothing", () => {
  it("returns parsed scenario response", async () => {
    const fetcher = mockFetch({
      status: 200,
      body: {
        scenario_id: "SCENARIO-GRAT-VS-DONOTHING-2026",
        inputs_snapshot: {},
        grat_path: {
          name: "GRAT path",
          gross_estate_at_term: "21000000.00",
          federal_estate_tax: "2400000.00",
          transferred_to_beneficiaries_outside_estate: "533954.86",
          net_to_beneficiaries: "19133954.86",
        },
        do_nothing_path: {
          name: "Do-nothing path",
          gross_estate_at_term: "29386561.92",
          federal_estate_tax: "5754624.77",
          transferred_to_beneficiaries_outside_estate: "0.00",
          net_to_beneficiaries: "23631937.15",
        },
        tax_savings: "3354624.77",
        additional_to_beneficiaries: "-4497982.29",
        grat_failed: false,
        notes: ["Educational projection only."],
      },
    });
    const client = new CalcEngineClient("http://test", fetcher);
    const out = await client.gratVsDoNothing({
      total_estate_at_year_zero: "20000000",
      grat_principal: "5000000",
      section_7520_rate: "0.052",
      projected_growth_rate: "0.08",
      term_years: 5,
    });
    expect(out.grat_failed).toBe(false);
    expect(out.tax_savings).toBe("3354624.77");
    expect(out.notes).toContain("Educational projection only.");
  });
});
