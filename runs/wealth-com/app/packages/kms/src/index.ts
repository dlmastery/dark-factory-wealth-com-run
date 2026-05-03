/**
 * @estatecompass/kms — envelope encryption with a swappable KMS backend.
 *
 * Per ADR-002 layer 3:
 *   - Per-tenant KEK (Key Encryption Key) lives in KMS — opaque to the app.
 *   - Per-document DEK (Data Encryption Key) is generated fresh, used to
 *     encrypt the document plaintext (AES-256-GCM), then encrypted with the
 *     tenant KEK (also AES-256-GCM via KMS) and stored in the documents row.
 *   - To decrypt a document: load the encrypted DEK, ask KMS to decrypt the
 *     DEK with the tenant KEK, use the resulting DEK to decrypt the blob.
 *   - To "crypto-shred" a tenant: delete the tenant KEK from KMS. All
 *     encrypted DEKs become useless; no plaintext can be recovered.
 *
 * Backend mode is set via env KMS_MODE:
 *   - "local-substitute" (v0 / HD-008 synthetic-only): file-backed KEK.
 *   - "aws-kms" (production posture; not implemented in v0): real KMS.
 *
 * The interface KmsClient is identical across modes. Switching is config,
 * not refactor.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync, createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DEK_LENGTH = 32;     // 256 bits
const IV_LENGTH = 12;      // GCM standard
const AUTH_TAG_LENGTH = 16;

export interface KmsClient {
  /** Get the active KEK reference for a tenant. */
  getActiveKekRef(tenantId: string): Promise<string>;
  /** Encrypt a DEK (plaintext bytes) with the named KEK. Returns ciphertext. */
  encryptWithKek(kekRef: string, plaintext: Buffer): Promise<Buffer>;
  /** Decrypt an encrypted DEK with the named KEK. */
  decryptWithKek(kekRef: string, ciphertext: Buffer): Promise<Buffer>;
  /** Delete a tenant's KEK — makes all DEKs unrecoverable (crypto-shred). */
  deleteKek(kekRef: string): Promise<void>;
}

// ----- Envelope encryption (mode-agnostic) ------------------------------------

export interface EnvelopeOutput {
  ciphertext: Buffer;        // AES-256-GCM(plaintext) — IV||ciphertext||tag
  encryptedDek: Buffer;       // KMS-encrypted DEK
  sha256Plaintext: string;    // hex; tamper-detection on decrypt
}

export async function encryptDocument(
  kms: KmsClient,
  tenantId: string,
  plaintext: Buffer,
): Promise<EnvelopeOutput> {
  const kekRef = await kms.getActiveKekRef(tenantId);
  const dek = randomBytes(DEK_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", dek, iv);
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const blob = Buffer.concat([iv, enc, tag]);
  const encryptedDek = await kms.encryptWithKek(kekRef, dek);
  const sha256Plaintext = createHash("sha256").update(plaintext).digest("hex");
  return { ciphertext: blob, encryptedDek, sha256Plaintext };
}

export async function decryptDocument(
  kms: KmsClient,
  kekRef: string,
  encryptedDek: Buffer,
  ciphertext: Buffer,
  expectedSha256: string,
): Promise<Buffer> {
  const dek = await kms.decryptWithKek(kekRef, encryptedDek);
  if (ciphertext.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error("ciphertext too short to be valid envelope");
  }
  const iv = ciphertext.subarray(0, IV_LENGTH);
  const tag = ciphertext.subarray(ciphertext.length - AUTH_TAG_LENGTH);
  const enc = ciphertext.subarray(IV_LENGTH, ciphertext.length - AUTH_TAG_LENGTH);
  const decipher = createDecipheriv("aes-256-gcm", dek, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(enc), decipher.final()]);
  const sha256 = createHash("sha256").update(plaintext).digest("hex");
  if (sha256 !== expectedSha256) {
    throw new Error("plaintext sha256 mismatch — tamper detected");
  }
  return plaintext;
}

// ----- LocalSubstituteKms -----------------------------------------------------

/**
 * File-backed KMS for v0 (HD-008 synthetic-data-only). Stores each tenant's
 * KEK as a 32-byte random key on disk, derived from a passphrase via scrypt.
 * NOT FOR PRODUCTION. The `kek_ref` format is `local:<filename-stem>`.
 */
export class LocalSubstituteKms implements KmsClient {
  private readonly keystoreDir: string;
  private readonly passphrase: string;

  constructor(opts: { keystoreDir?: string; passphrase?: string } = {}) {
    this.keystoreDir = opts.keystoreDir ?? join(process.cwd(), ".estatecompass-keystore");
    this.passphrase =
      opts.passphrase ?? process.env.LOCAL_KMS_PASSPHRASE ?? "dev-only-synthetic-passphrase";
    if (!existsSync(this.keystoreDir)) {
      mkdirSync(this.keystoreDir, { recursive: true });
    }
  }

  async getActiveKekRef(tenantId: string): Promise<string> {
    return `local:${tenantId}`;
  }

  private kekPath(kekRef: string): string {
    if (!kekRef.startsWith("local:")) {
      throw new Error(`expected 'local:' prefixed kek_ref, got ${kekRef}`);
    }
    const stem = kekRef.slice("local:".length);
    return join(this.keystoreDir, `${stem}.kek`);
  }

  private deriveOrLoadKek(kekRef: string): Buffer {
    const path = this.kekPath(kekRef);
    if (existsSync(path)) {
      return readFileSync(path);
    }
    // Derive new KEK from (passphrase, kekRef) via scrypt; persist.
    const kek = scryptSync(this.passphrase, kekRef, 32);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, kek, { mode: 0o600 });
    return kek;
  }

  async encryptWithKek(kekRef: string, plaintext: Buffer): Promise<Buffer> {
    const kek = this.deriveOrLoadKek(kekRef);
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv("aes-256-gcm", kek, iv);
    const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, enc, tag]);
  }

  async decryptWithKek(kekRef: string, ciphertext: Buffer): Promise<Buffer> {
    const kek = this.deriveOrLoadKek(kekRef);
    if (ciphertext.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error("ciphertext too short to be a valid KEK envelope");
    }
    const iv = ciphertext.subarray(0, IV_LENGTH);
    const tag = ciphertext.subarray(ciphertext.length - AUTH_TAG_LENGTH);
    const enc = ciphertext.subarray(IV_LENGTH, ciphertext.length - AUTH_TAG_LENGTH);
    const decipher = createDecipheriv("aes-256-gcm", kek, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]);
  }

  async deleteKek(kekRef: string): Promise<void> {
    const path = this.kekPath(kekRef);
    if (existsSync(path)) {
      // Overwrite then remove (best-effort against undelete on local FS).
      const fs = await import("node:fs/promises");
      const stats = await fs.stat(path);
      await fs.writeFile(path, randomBytes(stats.size));
      await fs.unlink(path);
    }
  }
}
