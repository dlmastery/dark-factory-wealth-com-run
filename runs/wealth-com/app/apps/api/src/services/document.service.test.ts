/**
 * DocumentService unit tests with in-memory fakes.
 * Verifies orchestration logic without DB or Fastify.
 */

import { describe, expect, it, beforeEach } from "vitest";
import type { QueryResult, QueryResultRow } from "pg";
import type { KmsClient } from "@estatecompass/kms";
import type { BlobStore } from "../storage/local-blob-store.js";
import { DocumentService } from "./document.service.js";

class FakeKms implements KmsClient {
  async getActiveKekRef(tenantId: string): Promise<string> {
    return `local:${tenantId}`;
  }
  async encryptWithKek(_kekRef: string, plaintext: Buffer): Promise<Buffer> {
    return Buffer.concat([Buffer.from("ENC:"), plaintext]);
  }
  async decryptWithKek(_kekRef: string, ciphertext: Buffer): Promise<Buffer> {
    return ciphertext.subarray(4);
  }
  async deleteKek(_kekRef: string): Promise<void> {}
}

class FakeBlobStore implements BlobStore {
  public puts: Array<{ tenantId: string; documentId: string; size: number }> = [];
  async put(tenantId: string, documentId: string, ciphertext: Buffer): Promise<string> {
    this.puts.push({ tenantId, documentId, size: ciphertext.length });
    return `file:///fake/${tenantId}/${documentId}.bin`;
  }
  async get(): Promise<Buffer> {
    throw new Error("not used");
  }
  async remove(): Promise<void> {}
}

interface FakeDb {
  inserts: Array<{ sql: string; values: unknown[] }>;
  query: <R extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ) => Promise<QueryResult<R>>;
  tenantId: string;
}

function makeFakeDb(kekRowId: string): FakeDb & { tenantId: string } {
  const fake: FakeDb = {
    inserts: [],
    tenantId: "00000000-0000-4000-8000-000000000a01" as string,
    query: async <R extends QueryResultRow>(text: string, values?: unknown[]) => {
      if (text.includes("FROM tenant_kms_keys")) {
        return { rows: [{ id: kekRowId }] as unknown as R[], rowCount: 1, command: "SELECT", oid: 0, fields: [] };
      }
      if (text.includes("INSERT INTO documents")) {
        fake.inserts.push({ sql: text, values: values ?? [] });
        return { rows: [], rowCount: 1, command: "INSERT", oid: 0, fields: [] };
      }
      throw new Error(`unexpected query: ${text.slice(0, 60)}`);
    },
  };
  return fake as FakeDb & { tenantId: string };
}

describe("DocumentService.upload", () => {
  let kms: FakeKms;
  let blobs: FakeBlobStore;
  let svc: DocumentService;

  beforeEach(() => {
    kms = new FakeKms();
    blobs = new FakeBlobStore();
    svc = new DocumentService(kms, blobs);
  });

  it("encrypts → stores → inserts in order", async () => {
    const db = makeFakeDb("kek-row-id-123");
    const result = await svc.upload(db as unknown as Parameters<typeof svc.upload>[0], {
      tenantId: "00000000-0000-4000-8000-000000000a01",
      householdId: "00000000-0000-4000-8000-000000000c01",
      uploadedByUserId: "00000000-0000-4000-8000-000000000b01",
      documentType: "REVOCABLE_TRUST",
      filename: "doe-trust.pdf",
      contentType: "application/pdf",
      plaintext: Buffer.from("hello world synthetic content"),
    });

    expect(result.byteSize).toBe(29);
    expect(result.documentId).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.sha256Plaintext).toMatch(/^[0-9a-f]{64}$/);
    expect(result.storageUrl).toMatch(/^file:\/\//);

    expect(blobs.puts).toHaveLength(1);
    expect(blobs.puts[0]?.tenantId).toBe("00000000-0000-4000-8000-000000000a01");

    expect(db.inserts).toHaveLength(1);
    const insertValues = db.inserts[0]!.values;
    expect(insertValues[0]).toBe(result.documentId);
    expect(insertValues[3]).toBe("REVOCABLE_TRUST");
    expect(insertValues[6]).toBe(29); // byte_size
  });

  it("rejects empty plaintext", async () => {
    const db = makeFakeDb("kek-row-id");
    await expect(
      svc.upload(db as unknown as Parameters<typeof svc.upload>[0], {
        tenantId: "00000000-0000-4000-8000-000000000a01",
        householdId: "00000000-0000-4000-8000-000000000c01",
        uploadedByUserId: "00000000-0000-4000-8000-000000000b01",
        documentType: "WILL",
        filename: "empty.pdf",
        contentType: "application/pdf",
        plaintext: Buffer.alloc(0),
      }),
    ).rejects.toThrow(/empty/);
  });

  it("rejects oversize plaintext (>50MB)", async () => {
    const db = makeFakeDb("kek-row-id");
    const oversize = Buffer.alloc(51 * 1024 * 1024);
    await expect(
      svc.upload(db as unknown as Parameters<typeof svc.upload>[0], {
        tenantId: "00000000-0000-4000-8000-000000000a01",
        householdId: "00000000-0000-4000-8000-000000000c01",
        uploadedByUserId: "00000000-0000-4000-8000-000000000b01",
        documentType: "WILL",
        filename: "big.pdf",
        contentType: "application/pdf",
        plaintext: oversize,
      }),
    ).rejects.toThrow(/50MB/);
  });

  it("propagates 'no active KMS key' when bootstrap row missing", async () => {
    const db: FakeDb = {
      inserts: [],
      tenantId: "00000000-0000-4000-8000-000000000a01",
      query: async <R extends QueryResultRow>(text: string) => {
        if (text.includes("FROM tenant_kms_keys")) {
          return { rows: [] as unknown as R[], rowCount: 0, command: "SELECT", oid: 0, fields: [] };
        }
        throw new Error("unexpected");
      },
    };
    await expect(
      svc.upload(db as unknown as Parameters<typeof svc.upload>[0], {
        tenantId: "00000000-0000-4000-8000-000000000a01",
        householdId: "00000000-0000-4000-8000-000000000c01",
        uploadedByUserId: "00000000-0000-4000-8000-000000000b01",
        documentType: "WILL",
        filename: "x.pdf",
        contentType: "application/pdf",
        plaintext: Buffer.from("ok"),
      }),
    ).rejects.toThrow(/no active KMS key/);
  });
});
