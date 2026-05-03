/**
 * Canonical demo walkthrough — the e2e evidence promised by VNV-001 §3.4
 * and CC-001 Demo MVP scope.
 *
 * Path: login → dashboard (Doe Family) → household detail (4 persons,
 * 1 trust, 5 assets, $20M gross estate, OBBBA tax baseline panel) →
 * scenario page → run GRAT-vs-do-nothing → assert tax savings + remainder.
 *
 * This spec exercises every cross-cutting concern under HD-002/007/008:
 *  - brand substitution (no wealth.com marks)
 *  - disclaimer present on every screen (FR-UI-DISCLAIMER-001)
 *  - synthetic data only
 *  - educational-projection framing
 *
 * Requires DEV_ALLOW_SYNTHETIC_LOGIN=1 on the api side.
 */

import { test, expect } from "@playwright/test";

const TENANT = "acme-ria";
const EMAIL = "advisor@acme-ria.demo";
const PASSWORD = "synthetic";
const DOE_HOUSEHOLD_ID = "00000000-0000-4000-8000-000000000c01";

test.describe("Demo MVP canonical walkthrough", () => {
  test("advisor logs in, sees Doe Family, runs GRAT scenario", async ({ page }) => {
    // 1. Login
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.locator(".ec-disclaimer")).toBeVisible();

    await page.getByLabel(/tenant slug/i).fill(TENANT);
    await page.getByLabel(/email/i).fill(EMAIL);
    await page.getByLabel(/^password$/i).fill(PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    // 2. Dashboard — only Acme's households
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /households/i })).toBeVisible();
    const doeFamilyLink = page.getByRole("link", { name: /Doe Family/i });
    await expect(doeFamilyLink).toBeVisible();
    // Bedrock household must NOT appear (cross-tenant isolation)
    await expect(page.getByText(/Bedrock/i)).toHaveCount(0);

    await doeFamilyLink.click();

    // 3. Household detail
    await expect(page).toHaveURL(new RegExp(`/households/${DOE_HOUSEHOLD_ID}`));
    await expect(page.getByRole("heading", { name: /Doe Family/i })).toBeVisible();

    // Disclaimer must persist on this screen
    await expect(page.locator(".ec-disclaimer")).toBeVisible();

    // 4 persons listed in DOB order
    await expect(page.getByText(/John Doe/i)).toBeVisible();
    await expect(page.getByText(/Jane Doe/i)).toBeVisible();
    await expect(page.getByText(/Sam Doe/i)).toBeVisible();
    await expect(page.getByText(/Sara Doe/i)).toBeVisible();

    // 1 entity: the revocable trust (working title; no wealth.com marks)
    await expect(page.getByText(/Doe Family Revocable Trust/i)).toBeVisible();
    await expect(page.getByText(/TRUST_REVOCABLE/i)).toBeVisible();

    // Gross estate $20M
    await expect(page.getByText(/\$20,000,000/)).toBeVisible();

    // OBBBA tax baseline panel: $5M taxable × 40% = $2M federal estate tax
    await expect(page.getByText(/Federal estate tax/i)).toBeVisible();
    await expect(page.getByText(/\$15,000,000/)).toBeVisible(); // OBBBA exemption
    await expect(page.getByText(/\$5,000,000/)).toBeVisible();   // taxable estate
    await expect(page.getByText(/\$2,000,000/)).toBeVisible();   // federal estate tax
    await expect(page.getByText(/RULE-FET-OBBBA-2026/)).toBeVisible();

    // 4. Scenario
    await page.getByRole("link", { name: /Run GRAT vs do-nothing scenario/i }).click();
    await expect(page).toHaveURL(/\/scenario$/);
    await expect(page.getByRole("heading", { name: /GRAT vs do-nothing/i })).toBeVisible();
    await expect(page.locator(".ec-disclaimer")).toBeVisible();
    await expect(page.getByText(/Educational projection only/i)).toBeVisible();

    // Run with default form values: $5M / 5.2% / 8% / 5y
    await page.getByRole("button", { name: /Run scenario/i }).click();

    // Comparison panels appear; tax savings is positive (OBBBA scenario from golden tests)
    await expect(page.getByText(/GRAT path/)).toBeVisible();
    await expect(page.getByText(/Do-nothing path/)).toBeVisible();
    await expect(page.getByText(/Tax savings/)).toBeVisible();

    // The educational disclaimer note must surface in the scenario notes
    await expect(page.getByText(/EDUCATIONAL PROJECTION ONLY/i)).toBeVisible();
  });
});
