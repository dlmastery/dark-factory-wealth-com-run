/**
 * Pure unit tests for config loading.
 */

import { afterEach, describe, expect, it } from "vitest";
import { loadConfig, resetConfigForTests } from "./config.js";

describe("loadConfig", () => {
  afterEach(() => resetConfigForTests());

  it("loads with sensible defaults when only DATABASE_URL is set", () => {
    const cfg = loadConfig({ DATABASE_URL: "postgres://x:y@localhost/z" } as NodeJS.ProcessEnv);
    expect(cfg.NODE_ENV).toBe("development");
    expect(cfg.PORT).toBe(3000);
    expect(cfg.JWT_ACCESS_TTL_SECONDS).toBe(900);
    expect(cfg.KMS_MODE).toBe("local-substitute");
  });

  it("rejects empty DATABASE_URL", () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/invalid config/);
  });

  it("rejects production with default JWT_SECRET", () => {
    expect(() =>
      loadConfig({
        NODE_ENV: "production",
        DATABASE_URL: "postgres://x:y@localhost/z",
      } as NodeJS.ProcessEnv),
    ).toThrow(/cannot run with the default JWT_SECRET/);
  });

  it("accepts production with a real JWT_SECRET", () => {
    const cfg = loadConfig({
      NODE_ENV: "production",
      DATABASE_URL: "postgres://x:y@localhost/z",
      JWT_SECRET: "this-is-a-real-production-secret-1234",
    } as NodeJS.ProcessEnv);
    expect(cfg.NODE_ENV).toBe("production");
  });

  it("port is coerced from string", () => {
    const cfg = loadConfig({
      DATABASE_URL: "postgres://x:y@localhost/z",
      PORT: "8080",
    } as NodeJS.ProcessEnv);
    expect(cfg.PORT).toBe(8080);
  });

  it("invalid LOG_LEVEL is rejected", () => {
    expect(() =>
      loadConfig({
        DATABASE_URL: "postgres://x:y@localhost/z",
        LOG_LEVEL: "verbose",
      } as NodeJS.ProcessEnv),
    ).toThrow(/invalid config/);
  });
});
