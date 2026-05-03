/**
 * Runtime configuration. Reads from env with sensible local-only defaults.
 * Per HD-008: synthetic-data-only at v0; the JWT_SECRET default is a public
 * placeholder, not a secret. Production (production_surface=true) must
 * override every value here.
 */

import { z } from "zod";

const Schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  AI_EXTRACT_URL: z.string().url().default("http://ai-extract:8000"),
  CALC_ENGINE_URL: z.string().url().default("http://calc-engine:8001"),
  // JWT — local-only secret. NEVER ship this default to production.
  JWT_SECRET: z
    .string()
    .min(16)
    .default("dev-only-synthetic-jwt-secret-change-me-in-prod"),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 15), // 15 min
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7), // 7 days
  KMS_MODE: z.enum(["local-substitute", "aws-kms"]).default("local-substitute"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
});

export type Config = z.infer<typeof Schema>;

let cached: Config | null = null;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  if (cached) return cached;
  const parsed = Schema.safeParse(env);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`invalid config: ${detail}`);
  }
  cached = parsed.data;
  if (cached.NODE_ENV === "production" && cached.JWT_SECRET.startsWith("dev-only-")) {
    throw new Error(
      "production environment cannot run with the default JWT_SECRET — set a real secret",
    );
  }
  return cached;
}

export function resetConfigForTests(): void {
  cached = null;
}
