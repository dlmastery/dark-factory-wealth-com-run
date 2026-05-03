/**
 * Fastify server bootstrap. Loads config, registers plugins in correct order
 * (auth → tenant-context → audit), wires routes, starts listening.
 *
 * The plugin order matters: tenant-context depends on req.auth being set
 * before its hook fires — Fastify resolves this via decorator dependency
 * by way of the requireAuth preHandler being installed before any route
 * handler that uses withTenantDb.
 */

import Fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import { configure as configureDb } from "@estatecompass/db";

import { loadConfig } from "./config.js";
import authPlugin from "./plugins/auth.js";
import tenantContextPlugin from "./plugins/tenant-context.js";
import auditPlugin from "./plugins/audit.js";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import householdRoutes from "./routes/households.routes.js";
import documentRoutes from "./routes/documents.routes.js";
import documentRoutes from "./routes/documents.routes.js";

export async function buildServer() {
  const cfg = loadConfig();

  configureDb({ connectionString: cfg.DATABASE_URL });

  const app = Fastify({
    logger: {
      level: cfg.LOG_LEVEL,
      ...(cfg.NODE_ENV === "development"
        ? { transport: { target: "pino-pretty" } }
        : {}),
    },
    trustProxy: true,
  });

  await app.register(sensible);
  await app.register(cors, { origin: true, credentials: true });

  await app.register(authPlugin);
  await app.register(tenantContextPlugin);
  await app.register(auditPlugin);

  // Health
  app.get("/health", async () => ({ status: "ok", service: "api" }));

  // v1
  await app.register(authRoutes);
  await app.register(meRoutes);
  await app.register(householdRoutes);
  await app.register(documentRoutes);

  return app;
}

async function main() {
  const cfg = loadConfig();
  const app = await buildServer();
  try {
    await app.listen({ host: "0.0.0.0", port: cfg.PORT });
  } catch (err) {
    app.log.error({ err }, "server failed to start");
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
