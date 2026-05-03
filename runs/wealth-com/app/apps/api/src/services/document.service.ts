/**
 * DocumentService — orchestrates the upload pipeline:
 *   plaintext → envelope encrypt (KMS) → write ciphertext to blob store
 *   → INSERT documents row referencing storage_url + encrypted_dek + sha256
 *
 * Per ADR-002 layers: tenant_id flows through every step; the documents
 * table itself is RLS-enforced so a stray INSERT with the wrong tenant_id
 * is rejected at the DB level.
 */

import { randomUUID } from "node:crypto";
import type { TenantClient } from "@estatecompass/db";
import { encryptDocument, type KmsClient } from "@estatecompass/kms";
import type { BlobStore } from "../storage/local-blob-store.js";

export type DocumentTypeEnum =
  | "WILL"
  | "REVOCABLE_TRUST"
  | "IRREVOCABLE_TRUST"
  | "POA"
  | "AHCD"
  | "BENEFICIARY_DESIGNATION"
  | "OTHER";

export interface UploadInput {
  tenantId: string;
  householdId: string;
  uploadedByUserId: string;
  documentType: DocumentTypeEnum;
  filename: string;
  contentType: string;
  plaintext: Buffer;
}

export interface UploadOutput {
  documentId: string;
  storageUrl: string;
  byteSize: number;
  sha256Plaintext: string;
}

export class DocumentService {
  constructor(
    private readonly kms: KmsClient,
    private readonly blobs: BlobStore,
  ) {}

  async upload(db: TenantClient, input: UploadInput): Promise<UploadOutput> {
    if (input.plaintext.length === 0) {
      throw new Error("plaintext is empty");
    }
    if (input.plaintext.length > 50 * 1024 * 1024) {
      // 50 MB ceiling at v0 — protects against unbounded memory at the
      // local-substitute layer. Production posture would stream.
      throw new Error("document exceeds 50MB v0 ceiling");
    }

    const documentId = randomUUID();

    // 1) Envelope encrypt
    const envelope = await encryptDocument(this.kms, input.tenantId, input.plaintext);

    // 2) Write ciphertext to blob store
    const storageUrl = await this.blobs.put(input.tenantId, documentId, envelope.ciphertext);

    // 3) Look up the active KEK row id to FK into
    const kekRow = await db.query<{ id: string }>(
      "SELECT id FROM tenant_kms_keys WHERE tenant_id = $1 AND is_active = TRUE LIMIT 1",
      [input.tenantId],
    );
    const kekKeyId = kekRow.rows[0]?.id;
    if (!kekKeyId) {
      // The migration bootstrapped these rows; this should not happen in practice.
      throw new Error(`no active KMS key for tenant ${input.tenantId}`);
    }

    // 4) INSERT documents row (RLS WITH CHECK confirms tenant_id matches session)
    await db.query(
      `INSERT INTO documents
          (id, tenant_id, household_id, document_type, filename, content_type,
           byte_size, storage_url, encrypted_dek, kek_key_id, sha256_plaintext,
           uploaded_by_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        documentId,
        input.tenantId,
        input.householdId,
        input.documentType,
        input.filename,
        input.contentType,
        input.plaintext.length,
        storageUrl,
        envelope.encryptedDek,
        kekKeyId,
        envelope.sha256Plaintext,
        input.uploadedByUserId,
      ],
    );

    return {
      documentId,
      storageUrl,
      byteSize: input.plaintext.length,
      sha256Plaintext: envelope.sha256Plaintext,
    };
  }
}
