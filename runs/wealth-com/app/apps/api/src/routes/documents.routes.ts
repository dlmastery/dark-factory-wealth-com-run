/**
 * Document upload + listing routes (Slice-3 wire-up).
 *
 *   POST /v1/households/:id/documents     multipart upload → encrypted → row
 *   GET  /v1/households/:id/documents     list household's documents
 *   GET  /v1/documents/:id                document metadata (no plaintext)
 *
 * Per ADR-003 + HD-007: this surface emits and stores documents; it does NOT
 * generate them. UPL boundary is preserved.
 */

import multipart from "@fastify/multipart";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { LocalSubstituteKms } from "@estatecompass/kms";
import { LocalBlobStore } from "../storage/local-blob-store.js";
import { DocumentService } from "../services/document.service.js";

const DocumentTypeSchema = z.enum([
  "WILL",
  "REVOCABLE_TRUST",
  "IRREVOCABLE_TRUST",
  "POA",
  "AHCD",
  "BENEFICIARY_DESIGNATION",
  "OTHER",
]);

export default async function documentRoutes(app: FastifyInstance) {
  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // matches DocumentService ceiling
      files: 1,
    },
  });

  const kms = new LocalSubstituteKms();
  const blobs = new LocalBlobStore();
  const docs = new DocumentService(kms, blobs);

  // POST /v1/households/:id/documents
  app.post<{ Params: { id: string } }>(
    "/v1/households/:id/documents",
    { preHandler: app.requireAuth },
    async (req, reply) => {
      const householdId = req.params.id;
      const data = await req.file();
      if (!data) {
        return reply.code(400).send({ error: "missing_file" });
      }
      const documentTypeRaw = (data.fields["document_type"] as { value?: string } | undefined)?.value;
      const parsedType = DocumentTypeSchema.safeParse(documentTypeRaw);
      if (!parsedType.success) {
        return reply.code(400).send({ error: "invalid_document_type", got: documentTypeRaw });
      }

      const plaintext = await data.toBuffer();

      const result = await req.withTenantDb(async (db) => {
        // Verify the household exists in the caller's tenant before writing.
        const exists = await db.query<{ id: string }>(
          "SELECT id FROM households WHERE id = $1 AND archived_at IS NULL",
          [householdId],
        );
        if (exists.rows.length === 0) {
          return null;
        }
        return docs.upload(db, {
          tenantId: req.auth!.tenant_id,
          householdId,
          uploadedByUserId: req.auth!.sub,
          documentType: parsedType.data,
          filename: data.filename ?? "untitled",
          contentType: data.mimetype ?? "application/octet-stream",
          plaintext,
        });
      });

      if (!result) return reply.code(404).send({ error: "household_not_found" });
      return reply.code(201).send({
        document_id: result.documentId,
        byte_size: result.byteSize,
        sha256: result.sha256Plaintext,
      });
    },
  );

  // GET /v1/households/:id/documents
  app.get<{ Params: { id: string } }>(
    "/v1/households/:id/documents",
    { preHandler: app.requireAuth },
    async (req, reply) => {
      const rows = await req.withTenantDb(async (db) => {
        const result = await db.query<{
          id: string;
          document_type: string;
          filename: string;
          byte_size: string;
          sha256_plaintext: string;
          uploaded_at: Date;
        }>(
          `SELECT id, document_type, filename, byte_size::text, sha256_plaintext, uploaded_at
             FROM documents
            WHERE household_id = $1 AND archived_at IS NULL
            ORDER BY uploaded_at DESC`,
          [req.params.id],
        );
        return result.rows;
      });
      return reply.send({ documents: rows, count: rows.length });
    },
  );

  // GET /v1/documents/:id — metadata only; plaintext requires explicit retrieval flow.
  app.get<{ Params: { id: string } }>(
    "/v1/documents/:id",
    { preHandler: app.requireAuth },
    async (req, reply) => {
      const result = await req.withTenantDb(async (db) => {
        const { rows } = await db.query<{
          id: string;
          household_id: string;
          document_type: string;
          filename: string;
          content_type: string;
          byte_size: string;
          sha256_plaintext: string;
          uploaded_at: Date;
        }>(
          `SELECT id, household_id, document_type, filename, content_type,
                  byte_size::text, sha256_plaintext, uploaded_at
             FROM documents WHERE id = $1 AND archived_at IS NULL`,
          [req.params.id],
        );
        return rows[0];
      });
      if (!result) return reply.code(404).send({ error: "not_found" });
      return reply.send(result);
    },
  );
}
