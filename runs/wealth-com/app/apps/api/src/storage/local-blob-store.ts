/**
 * BlobStore — abstracts the document blob storage backend.
 *
 * v0 (HD-008 synthetic-only, production_surface=false): file-system backed.
 * Stores ciphertext blobs under `<root>/<tenant_id>/<document_id>.bin`.
 *
 * Production posture: swap LocalBlobStore for an S3 implementation that
 * uses Object Lock + bucket policy denying delete. Same interface; the
 * upload route does not change.
 *
 * Per ADR-002: blobs are written ENCRYPTED (envelope encryption already
 * applied by @estatecompass/kms before reaching this store). The blob
 * store sees only ciphertext; no plaintext ever lands on disk.
 */

import { existsSync, mkdirSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface BlobStore {
  /** Persist a ciphertext blob; returns the storage URL. */
  put(tenantId: string, documentId: string, ciphertext: Buffer): Promise<string>;
  /** Read a ciphertext blob by storage URL. */
  get(storageUrl: string): Promise<Buffer>;
  /** Remove a blob (used when a document is hard-deleted). */
  remove(storageUrl: string): Promise<void>;
}

export class LocalBlobStore implements BlobStore {
  private readonly root: string;

  constructor(opts: { root?: string } = {}) {
    this.root = opts.root ?? join(process.cwd(), ".estatecompass-blobs");
    if (!existsSync(this.root)) {
      mkdirSync(this.root, { recursive: true });
    }
  }

  private path(tenantId: string, documentId: string): string {
    return join(this.root, tenantId, `${documentId}.bin`);
  }

  async put(tenantId: string, documentId: string, ciphertext: Buffer): Promise<string> {
    const tenantDir = join(this.root, tenantId);
    if (!existsSync(tenantDir)) {
      mkdirSync(tenantDir, { recursive: true });
    }
    const filePath = this.path(tenantId, documentId);
    await writeFile(filePath, ciphertext, { mode: 0o600 });
    return `file://${filePath.replace(/\\/g, "/")}`;
  }

  async get(storageUrl: string): Promise<Buffer> {
    if (!storageUrl.startsWith("file://")) {
      throw new Error(`unsupported storage_url scheme: ${storageUrl}`);
    }
    const filePath = storageUrl.slice("file://".length);
    return readFile(filePath);
  }

  async remove(storageUrl: string): Promise<void> {
    if (!storageUrl.startsWith("file://")) return;
    const filePath = storageUrl.slice("file://".length);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  }
}
