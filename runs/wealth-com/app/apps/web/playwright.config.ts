import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the EstateCompass advisor walkable UI.
 *
 * Per VNV-001 §3.9 (Browser/WYSIWYG mandatory for ui_surface=true) and
 * ARC-005 §6 cross-tenant attacks; specs evidence the demo path + the
 * disclaimer-on-every-screen requirement (FR-UI-DISCLAIMER-001).
 *
 * Run: docker compose up; then `pnpm -F @estatecompass/web e2e`.
 * Webserver baseURL: http://localhost:5173 (Vite dev). API: http://localhost:3000.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // demo seed assumes sequential mutations
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html"]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: process.env.E2E_NO_AUTOSTART
    ? undefined
    : {
        command: "pnpm dev",
        url: "http://localhost:5173",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
