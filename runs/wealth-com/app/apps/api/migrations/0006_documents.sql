-- 0006_documents.sql — Slice-3 Document Vault.
-- Per ADR-002 layer 3: per-tenant KMS data keys + envelope encryption posture.
-- Per ADR-003: extracted_facts carry full provenance + confidence + tier.
-- Per HD-008: at v0 the KMS is a local-substitute (file-backed); the schema
-- is identical to the production posture so the migration to a real KMS is
-- configuration, not a refactor.

BEGIN;

-- ----------------------------------------------------------------------------
-- TENANT KMS KEYS — KEK references per tenant.
-- The KEK itself is opaque to the database (it lives in KMS); we store only
-- the reference. Rotated_at tracks last rotation per ADR-002 #4.
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_kms_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    kek_ref         TEXT NOT NULL,                      -- e.g., 'local:keystore/acme.bin' or 'aws-kms:alias/tenant-acme'
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rotated_at      TIMESTAMPTZ,
    UNIQUE (tenant_id, kek_ref)
);
CREATE INDEX tenant_kms_keys_active_idx ON tenant_kms_keys(tenant_id) WHERE is_active = TRUE;

ALTER TABLE tenant_kms_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_kms_keys FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_kms_keys_isolation ON tenant_kms_keys
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- ----------------------------------------------------------------------------
-- DOCUMENTS — uploaded estate instruments (will, trust, POA, AHCD, etc.)
-- ----------------------------------------------------------------------------
CREATE TYPE document_type_enum AS ENUM (
    'WILL',
    'REVOCABLE_TRUST',
    'IRREVOCABLE_TRUST',
    'POA',                  -- Power of Attorney
    'AHCD',                 -- Advance Health Care Directive
    'BENEFICIARY_DESIGNATION',
    'OTHER'
);

CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    document_type       document_type_enum NOT NULL,
    filename            TEXT NOT NULL,
    content_type        TEXT NOT NULL DEFAULT 'application/pdf',
    byte_size           BIGINT NOT NULL CHECK (byte_size >= 0),
    -- Storage location of the encrypted blob. Local-substitute writes to a
    -- file on disk; production posture uses S3/Object-Lock object key.
    storage_url         TEXT NOT NULL,
    -- Per-document DEK encrypted with the tenant KEK (envelope encryption).
    -- DEK is opaque ciphertext; the api decrypts on read using the active KEK.
    encrypted_dek       BYTEA NOT NULL,
    kek_key_id          UUID NOT NULL REFERENCES tenant_kms_keys(id),
    sha256_plaintext    TEXT NOT NULL,                  -- 64 hex chars; tamper detection
    uploaded_by_user_id UUID NOT NULL REFERENCES users(id),
    uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at         TIMESTAMPTZ
);
CREATE INDEX documents_household_idx ON documents(tenant_id, household_id) WHERE archived_at IS NULL;
CREATE INDEX documents_type_idx ON documents(tenant_id, document_type);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;
CREATE POLICY documents_isolation ON documents
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- ----------------------------------------------------------------------------
-- EXTRACTED FACTS — Sage extractor output (Slice-4 writes here).
-- Mirrors packages/contracts/extraction.json schema but flattened for query.
-- Per ADR-003: every fact has provenance + confidence_tier + excerpt_hash.
-- ----------------------------------------------------------------------------
CREATE TYPE confidence_tier_enum AS ENUM (
    'high',
    'medium',
    'low',
    'requires_human_review'
);

CREATE TYPE extraction_method_enum AS ENUM (
    'ocr_layout',
    'llm_grounded',
    'rule_based',
    'human'
);

CREATE TABLE extracted_facts (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    document_id              UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    extraction_run_id        UUID NOT NULL,             -- groups facts from one /v1/extract call
    field_path               TEXT NOT NULL,             -- e.g., 'trust.successor_trustee.name'
    value_json               JSONB,                     -- nullable for refusals / requires_human_review
    confidence               NUMERIC(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    confidence_tier          confidence_tier_enum NOT NULL,
    extraction_method        extraction_method_enum NOT NULL,
    model_version            TEXT,
    attorney_review_required BOOLEAN NOT NULL DEFAULT FALSE,
    -- Provenance
    page                     INTEGER NOT NULL CHECK (page >= 1),
    bbox_json                JSONB,                     -- nullable; OCR-mode only
    source_excerpt           TEXT NOT NULL,             -- ≤300 chars in practice; not enforced at DB level
    excerpt_hash             TEXT NOT NULL,             -- 64 hex chars sha256
    -- Advisor decision
    review_status            TEXT NOT NULL DEFAULT 'pending'
                             CHECK (review_status IN ('pending', 'accepted', 'edited', 'rejected')),
    reviewed_by_user_id      UUID REFERENCES users(id),
    reviewed_at              TIMESTAMPTZ,
    review_notes             TEXT,
    edited_value_json        JSONB,                     -- when review_status='edited'
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX extracted_facts_document_idx ON extracted_facts(tenant_id, document_id);
CREATE INDEX extracted_facts_run_idx ON extracted_facts(tenant_id, extraction_run_id);
CREATE INDEX extracted_facts_review_pending_idx ON extracted_facts(tenant_id, review_status)
    WHERE review_status = 'pending';

ALTER TABLE extracted_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_facts FORCE ROW LEVEL SECURITY;
CREATE POLICY extracted_facts_isolation ON extracted_facts
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- Grant CRUD on the new tables to the application role
GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_kms_keys, documents, extracted_facts TO estatecompass_app;

-- Bootstrap a tenant_kms_keys row for each existing tenant (reuse the kek_ref
-- we set in 0001_init's tenants seed).
INSERT INTO tenant_kms_keys (tenant_id, kek_ref)
    SELECT id, kek_ref FROM tenants;

COMMIT;
