/**
 * Slice-2 integration test — Household aggregate root has tenant isolation
 * + the seed-data round-trips: a household with 4 persons, 1 entity, 6 roles,
 * 5 assets summing to $20M.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { asTenantId, configure, shutdown, withTenant } from "../../src/index.js";

const TEST_DB_URL = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

const ACME_TENANT = "00000000-0000-4000-8000-000000000a01";
const BEDROCK_TENANT = "00000000-0000-4000-8000-000000000a02";
const DOE_HOUSEHOLD = "00000000-0000-4000-8000-000000000c01";

describe.skipIf(!TEST_DB_URL)("household-aggregate (Slice-2)", () => {
  beforeAll(() => configure({ connectionString: TEST_DB_URL }));
  afterAll(() => shutdown());

  it("Acme advisor sees Doe Family with full aggregate", async () => {
    const result = await withTenant(asTenantId(ACME_TENANT), async (db) => {
      const households = await db.query<{ id: string; display_name: string }>(
        "SELECT id, display_name FROM households WHERE id = $1",
        [DOE_HOUSEHOLD],
      );
      const persons = await db.query<{ full_name: string }>(
        "SELECT full_name FROM persons WHERE household_id = $1 ORDER BY date_of_birth",
        [DOE_HOUSEHOLD],
      );
      const entities = await db.query<{ name: string }>(
        "SELECT name FROM entities WHERE household_id = $1",
        [DOE_HOUSEHOLD],
      );
      const roles = await db.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM roles WHERE household_id = $1",
        [DOE_HOUSEHOLD],
      );
      const assetSum = await db.query<{ total: string }>(
        "SELECT COALESCE(SUM(fair_market_value), 0)::text AS total FROM assets WHERE household_id = $1",
        [DOE_HOUSEHOLD],
      );
      return { households, persons, entities, roles, assetSum };
    });

    expect(result.households.rows).toHaveLength(1);
    expect(result.households.rows[0]?.display_name).toBe("Doe Family");
    expect(result.persons.rows).toHaveLength(4);
    expect(result.persons.rows.map((r) => r.full_name)).toEqual([
      "John Doe",
      "Jane Doe",
      "Sam Doe",
      "Sara Doe",
    ]);
    expect(result.entities.rows).toHaveLength(1);
    expect(result.entities.rows[0]?.name).toBe("Doe Family Revocable Trust");
    expect(result.roles.rows[0]?.count).toBe("6");
    expect(result.assetSum.rows[0]?.total).toBe("20000000.00");
  });

  it("Bedrock advisor cannot read Doe Family", async () => {
    const result = await withTenant(asTenantId(BEDROCK_TENANT), async (db) => {
      return db.query<{ id: string }>("SELECT id FROM households WHERE id = $1", [
        DOE_HOUSEHOLD,
      ]);
    });
    expect(result.rows).toHaveLength(0);
  });

  it("CHECK constraint on person date_of_death without deceased=true blocks insert", async () => {
    await expect(
      withTenant(asTenantId(ACME_TENANT), async (db) => {
        return db.query(
          "INSERT INTO persons (tenant_id, household_id, full_name, deceased, date_of_death) VALUES ($1, $2, 'Bad Data', FALSE, '2020-01-01')",
          [ACME_TENANT, DOE_HOUSEHOLD],
        );
      }),
    ).rejects.toThrow();
  });

  it("distribution_share CHECK rejects out-of-range values", async () => {
    await expect(
      withTenant(asTenantId(ACME_TENANT), async (db) => {
        return db.query(
          "INSERT INTO roles (tenant_id, household_id, role_type, person_id, distribution_share) VALUES ($1, $2, 'BENEFICIARY', '00000000-0000-4000-8000-000000000d03', 1.5)",
          [ACME_TENANT, DOE_HOUSEHOLD],
        );
      }),
    ).rejects.toThrow();
  });
});
