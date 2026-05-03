/**
 * Cross-tenant isolation evidence per ARC-005 §2.2 T-HH-1/2/3 + ADR-002.
 *
 * Bedrock advisor must not see Acme's Doe Family — even by direct URL guess.
 * Backend RLS makes this impossible at Postgres level; this spec confirms
 * the UI-level outcome (404 redirect / empty state / no leakage).
 */

import { test, expect } from "@playwright/test";

const ACME_HOUSEHOLD_ID = "00000000-0000-4000-8000-000000000c01"; // Doe Family

test.describe("Cross-tenant isolation (T-HH-1/2/3)", () => {
  test("Bedrock advisor sees no Acme households on dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/tenant slug/i).fill("bedrock-wealth");
    await page.getByLabel(/email/i).fill("advisor@bedrock-wealth.demo");
    await page.getByLabel(/^password$/i).fill("synthetic");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/$/);
    // Bedrock has its own seed household but NOT Doe Family
    await expect(page.getByText(/Doe Family/i)).toHaveCount(0);
    await expect(page.getByText(/Bedrock/i)).toBeVisible();
  });

  test("Bedrock advisor cannot reach Acme's household by direct URL", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/tenant slug/i).fill("bedrock-wealth");
    await page.getByLabel(/email/i).fill("advisor@bedrock-wealth.demo");
    await page.getByLabel(/^password$/i).fill("synthetic");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Try direct ID-guess attack
    await page.goto(`/households/${ACME_HOUSEHOLD_ID}`);
    // Backend returns 404 (not 403; do not leak existence). UI must render
    // its not-found state, NOT the Doe Family detail.
    await expect(page.getByText(/Doe Family/i)).toHaveCount(0);
    await expect(page.getByText(/John Doe/i)).toHaveCount(0);
    // Either the page shows "Not found" or remains on a safe route.
    const notFoundVisible = await page.getByText(/not found/i).isVisible().catch(() => false);
    const urlIsSafe = !/0{8}-0{4}-4000-8000-/i.test(page.url());
    expect(notFoundVisible || urlIsSafe).toBeTruthy();
  });
});
