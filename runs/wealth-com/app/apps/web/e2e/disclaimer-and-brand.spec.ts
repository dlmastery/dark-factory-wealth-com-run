/**
 * FR-UI-DISCLAIMER-001 + HD-002 brand substitution evidence.
 *
 * Per HD-007 + ADR-003 + UPL discipline, the advisor-facing UI MUST render
 * the educational-draft disclaimer on every screen. This spec walks every
 * route and asserts the disclaimer is present.
 *
 * Per HD-002, no wealth.com registered marks (Ester, Family Office Suite,
 * EstateFlow, Heritage Map, Plan for Every Tomorrow) may appear in the
 * UI text. EstateCompass + Sage are the working substitutes.
 */

import { test, expect } from "@playwright/test";

const FORBIDDEN_MARKS = [
  /Ester(®|™)?\b/,
  /Family Office Suite(™)?/i,
  /EstateFlow(™)?/i,
  /Heritage Map/i,
  /Plan for Every Tomorrow(™)?/i,
];

test.describe("Disclaimer presence (FR-UI-DISCLAIMER-001) + brand substitution (HD-002)", () => {
  test("login screen renders disclaimer + uses substituted brand", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator(".ec-disclaimer")).toBeVisible();
    await expect(page.locator(".ec-disclaimer")).toContainText(/educational/i);
    await expect(page.locator(".ec-disclaimer")).toContainText(/not a law firm/i);

    const html = await page.content();
    for (const mark of FORBIDDEN_MARKS) {
      expect(html).not.toMatch(mark);
    }
    expect(html).toMatch(/EstateCompass/);
  });

  test("dashboard renders disclaimer (post-login)", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/tenant slug/i).fill("acme-ria");
    await page.getByLabel(/email/i).fill("advisor@acme-ria.demo");
    await page.getByLabel(/^password$/i).fill("synthetic");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(".ec-disclaimer")).toBeVisible();

    const html = await page.content();
    for (const mark of FORBIDDEN_MARKS) {
      expect(html).not.toMatch(mark);
    }
  });

  test("footer reaffirms synthetic-only + not-legal-advice posture", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText(/Synthetic data only/i)).toBeVisible();
    await expect(page.getByText(/Not legal or tax advice/i)).toBeVisible();
  });
});
