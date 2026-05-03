/**
 * Thin api client for the EstateCompass UI. Stores access token in
 * sessionStorage (HD-008 v0; production posture would use httpOnly cookies).
 */

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
const TOKEN_KEY = "ec.access_token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string): void {
  sessionStorage.setItem(TOKEN_KEY, t);
}
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (!headers.has("content-type") && init.body) headers.set("content-type", "application/json");
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    throw new ApiError("unauthorized", 401);
  }
  if (!res.ok) {
    throw new ApiError(`api ${res.status}: ${await res.text()}`, res.status);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

// ---- typed endpoints ----

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: string;
}

export async function login(email: string, password: string, tenant_slug: string): Promise<{ access_token: string; user: User }> {
  return request("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, tenant_slug }),
  });
}

export async function me(): Promise<User> {
  return request("/v1/me");
}

export interface HouseholdSummary {
  id: string;
  display_name: string;
  primary_residence_state: string | null;
  created_at: string;
}

export async function listHouseholds(): Promise<{ households: HouseholdSummary[]; count: number }> {
  return request("/v1/households");
}

export async function getHousehold(id: string): Promise<{
  household: { id: string; display_name: string; primary_residence_state: string | null; notes: string | null };
  persons: Array<{ id: string; full_name: string; date_of_birth: string | null; relationship_to_primary: string }>;
  entities: Array<{ id: string; name: string; entity_type: string; jurisdiction: string | null }>;
  assets: Array<{ id: string; asset_class: string; description: string; fair_market_value: string }>;
  gross_estate: string;
}> {
  return request(`/v1/households/${id}`);
}

export interface TaxBaseline {
  household_id: string;
  gross_estate: string;
  rule_id: string;
  citation: string;
  computation_version: string;
  taxable_estate: string;
  federal_estate_tax: string;
  available_exemption: string;
  breakdown: Record<string, string>;
}

export async function getTaxBaseline(householdId: string): Promise<TaxBaseline> {
  return request(`/v1/households/${householdId}/tax-baseline`);
}

export interface ScenarioPath {
  name: string;
  gross_estate_at_term: string;
  federal_estate_tax: string;
  transferred_to_beneficiaries_outside_estate: string;
  net_to_beneficiaries: string;
}

export interface GRATScenarioResult {
  scenario_id: string;
  grat_path: ScenarioPath;
  do_nothing_path: ScenarioPath;
  tax_savings: string;
  additional_to_beneficiaries: string;
  grat_failed: boolean;
  notes: string[];
}

export async function runGRATScenario(
  householdId: string,
  body: {
    grat_principal: string;
    section_7520_rate: string;
    projected_growth_rate: string;
    term_years: number;
    dsue_amount?: string;
  },
): Promise<GRATScenarioResult> {
  return request(`/v1/households/${householdId}/scenarios/grat-vs-donothing`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
