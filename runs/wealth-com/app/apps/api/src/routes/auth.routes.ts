/**
 * Auth routes — POST /v1/auth/login.
 *
 * Slice-1 v0: minimal email/password against the users table. Argon2id hash
 * verification. Returns access JWT (TTL 15m default) on success. Refresh-
 * token flow is forthcoming.
 *
 * Per HD-008: synthetic data only at v0. The seed data uses a placeholder
 * password_hash; this handler accepts any password matching the synthetic
 * pattern when DEV_ALLOW_SYNTHETIC_LOGIN is set, for local demo only.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { withAdminClient } from "@estatecompass/db";
import { z } from "zod";
import argon2 from "argon2";
import { buildClaims, type Role } from "../plugins/auth.js";

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  tenant_slug: z.string().min(1),
});

interface UserRow {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
  status: string;
}

export default async function authRoutes(app: FastifyInstance) {
  app.post("/v1/auth/login", async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
    }
    const { email, password, tenant_slug } = parsed.data;

    // Lookup the user via admin client (the login endpoint must read across
    // tenants by design — but only by tenant_slug + email composite key.)
    const user = await withAdminClient(async (c) => {
      const { rows } = await c.query<UserRow>(
        `SELECT u.id, u.tenant_id, u.email, u.password_hash, u.full_name, u.role, u.status
           FROM users u
           JOIN tenants t ON t.id = u.tenant_id
          WHERE u.email = $1 AND t.slug = $2 AND t.status = 'active'
          LIMIT 1`,
        [email, tenant_slug],
      );
      return rows[0];
    });

    if (!user || user.status !== "active") {
      // Constant-time-ish: do an argon2 verify against a placeholder anyway to
      // reduce timing leaks. Not perfect; production would use a known-bad hash.
      try {
        await argon2.verify(
          "$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          password,
        );
      } catch {
        // expected
      }
      return reply.code(401).send({ error: "invalid_credentials" });
    }

    // Synthetic-data login path: placeholder hash starts with $argon2id$placeholder$
    let passwordOk = false;
    if (user.password_hash.startsWith("$argon2id$placeholder$")) {
      passwordOk = process.env.DEV_ALLOW_SYNTHETIC_LOGIN === "1";
    } else {
      try {
        passwordOk = await argon2.verify(user.password_hash, password);
      } catch {
        passwordOk = false;
      }
    }
    if (!passwordOk) {
      return reply.code(401).send({ error: "invalid_credentials" });
    }

    const claims = buildClaims({
      id: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
      email: user.email,
    });
    const token = app.jwt.sign(claims);

    return reply.send({
      access_token: token,
      token_type: "Bearer",
      user: {
        id: user.id,
        tenant_id: user.tenant_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  });
}
