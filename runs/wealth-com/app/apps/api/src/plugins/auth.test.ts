/**
 * Pure unit tests for the auth helpers — no Fastify, no DB, no JWT runtime.
 */

import { describe, expect, it } from "vitest";
import { buildClaims, roleAtLeast } from "./auth.js";

describe("buildClaims", () => {
  it("maps a user row to JWT claims", () => {
    const user = {
      id: "00000000-0000-4000-8000-000000000b01",
      tenant_id: "00000000-0000-4000-8000-000000000a01",
      role: "advisor" as const,
      email: "advisor@acme-ria.demo",
    };
    const claims = buildClaims(user);
    expect(claims).toEqual({
      sub: user.id,
      tenant_id: user.tenant_id,
      role: "advisor",
      email: user.email,
    });
  });
});

describe("roleAtLeast", () => {
  it("admin satisfies every required level", () => {
    expect(roleAtLeast("admin", "admin")).toBe(true);
    expect(roleAtLeast("admin", "advisor")).toBe(true);
    expect(roleAtLeast("admin", "paraplanner")).toBe(true);
    expect(roleAtLeast("admin", "read_only")).toBe(true);
  });

  it("advisor cannot escalate to admin", () => {
    expect(roleAtLeast("advisor", "admin")).toBe(false);
    expect(roleAtLeast("advisor", "advisor")).toBe(true);
    expect(roleAtLeast("advisor", "paraplanner")).toBe(true);
    expect(roleAtLeast("advisor", "read_only")).toBe(true);
  });

  it("paraplanner has no admin/advisor rights", () => {
    expect(roleAtLeast("paraplanner", "admin")).toBe(false);
    expect(roleAtLeast("paraplanner", "advisor")).toBe(false);
    expect(roleAtLeast("paraplanner", "paraplanner")).toBe(true);
    expect(roleAtLeast("paraplanner", "read_only")).toBe(true);
  });

  it("read_only cannot do anything beyond reading", () => {
    expect(roleAtLeast("read_only", "admin")).toBe(false);
    expect(roleAtLeast("read_only", "advisor")).toBe(false);
    expect(roleAtLeast("read_only", "paraplanner")).toBe(false);
    expect(roleAtLeast("read_only", "read_only")).toBe(true);
  });
});
