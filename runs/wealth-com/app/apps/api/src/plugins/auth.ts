/**
 * Auth plugin — JWT verification + role-based authorization decorators.
 *
 * Per ADR-002: every authenticated request carries a tenant_id claim from
 * the JWT, which the tenant-context plugin uses to bind RLS via withTenant.
 *
 * JWT claims:
 *   sub: user_id (UUID)
 *   tenant_id: tenant the user belongs to (UUID)
 *   role: 'admin' | 'advisor' | 'paraplanner' | 'read_only'
 *   email: user email (for log/audit; not authoritative)
 *   iat, exp: standard
 */

import fp from "fastify-plugin";
import jwtPlugin from "@fastify/jwt";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { loadConfig } from "../config.js";

export type Role = "admin" | "advisor" | "paraplanner" | "read_only";

export interface AuthClaims {
  sub: string;        // user_id
  tenant_id: string;
  role: Role;
  email: string;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AuthClaims;
    user: AuthClaims;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (
      ...roles: Role[]
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    auth?: AuthClaims;
  }
}

export default fp(async (app: FastifyInstance) => {
  const cfg = loadConfig();

  await app.register(jwtPlugin, {
    secret: cfg.JWT_SECRET,
    sign: { expiresIn: cfg.JWT_ACCESS_TTL_SECONDS },
  });

  // Decorator: requireAuth — verifies JWT, populates req.auth.
  app.decorate("requireAuth", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
      req.auth = req.user;
    } catch (err) {
      reply.code(401).send({ error: "unauthorized" });
    }
  });

  // Decorator factory: requireRole(...roles) — must be combined with requireAuth.
  app.decorate("requireRole", (...roles: Role[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.auth) {
        reply.code(401).send({ error: "unauthorized" });
        return;
      }
      if (!roles.includes(req.auth.role)) {
        reply.code(403).send({ error: "forbidden", required_roles: roles });
        return;
      }
    };
  });
});

/**
 * Pure helper: choose a JWT payload from a user row. Exported for unit tests
 * (does not require a Fastify instance).
 */
export function buildClaims(user: {
  id: string;
  tenant_id: string;
  role: Role;
  email: string;
}): AuthClaims {
  return {
    sub: user.id,
    tenant_id: user.tenant_id,
    role: user.role,
    email: user.email,
  };
}

/**
 * Pure helper: role hierarchy check. admin > advisor > paraplanner > read_only.
 * Exported for unit tests.
 */
const ROLE_RANK: Record<Role, number> = {
  admin: 4,
  advisor: 3,
  paraplanner: 2,
  read_only: 1,
};
export function roleAtLeast(actual: Role, required: Role): boolean {
  return ROLE_RANK[actual] >= ROLE_RANK[required];
}
