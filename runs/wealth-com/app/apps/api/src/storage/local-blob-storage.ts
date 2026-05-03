/**
 * Local-substitute blob storage. v0 / HD-008 only.
 *
 * Production posture writes to S3 with Object Lock. The interface
 * `BlobStorage` is identical so the swap is configuration, not refactor.
 *
 * Layout: <root>/<tenant_id>/<document_id>.blob
 *   The blob is the encrypted ciphertext from packages/kms's encryptDocument.
 *   Plaintext NEVER touches disk in this implementation.
 */

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

export interface BlobStorage {
  put: (tenantId: string, documentId: string, ciphertext: Buffer) => Promise<string>;
  get: (storageUrl: string) => Promise<Buffer>;
  delete: (storageUrl: string) => Promise<void>;
}

export class LocalBlobStorage implements BlobStorage {
  constructor(private readonly root: string) {}

  private path(tenantId: string, documentId: string): string {
    if (!/^[0-9a-f-]{36}$/i.test(tenantId)) throw new Error("invalid tenantId");
    if (!/^[0-9a-f-]{36}$/i.test(documentId)) throw new Error("invalid documentId");
    return join(this.root, tenantId, `${documentId}.blob`);
  }

  async put(tenantId: string, documentId: string, ciphertext: Buffer): Promise<string> {
    const p = this.path(tenantId, documentId);
    if (!existsSync(dirname(p))) {
      await mkdir(dirname(p), { recursive: true });
    }
    await writeFile(p, ciphertext, { mode: 0o600 });
    return `local://${tenantId}/${documentId}.blob`;
  }

  async get(storageUrl: string): Promise<Buffer> {
    const m = /^local:\/\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.blob$/i.exec(storageUrl);
    if (!m) throw new Error(`invalid storageUrl: ${storageUrl}`);
    return readFile(this.path(m[1]!, m[2]!));
  }

  async delete(storageUrl: string): Promise<void> {
    const m = /^local:\/\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.blob$/i.exec(storageUrl);
    if (!m) throw new Error(`invalid storageUrl: ${storageUrl}`);
    const p = this.path(m[1]!, m[2]!);
    if (existsSync(p)) await unlink(p);
  }
}
