-- 0004_households.sql — Slice-2 Household domain (DDD aggregate root).
-- Per ADR-002: every tenant-scoped table has tenant_id + RLS policy.
-- Per DDD-001 ubiquitous-language glossary.

BEGIN;

-- ----------------------------------------------------------------------------
-- HOUSEHOLDS — aggregate root for client family unit
-- ----------------------------------------------------------------------------
CREATE TABLE households (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    display_name    TEXT NOT NULL,
    primary_residence_state TEXT,                       -- 2-letter US state (relevant for state estate-tax modeling; see RSK note in HLD §6)
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at     TIMESTAMPTZ
);
CREATE INDEX households_tenant_idx ON households(tenant_id) WHERE archived_at IS NULL;

ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE households FORCE ROW LEVEL SECURITY;
CREATE POLICY households_tenant_isolation ON households
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- ----------------------------------------------------------------------------
-- PERSONS — natural persons within a household (grantor, beneficiary, trustee, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE persons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    household_id    UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    date_of_birth   DATE,
    -- PII fields (per HD-008 SYNTHETIC ONLY at v0; per ADR-002 Layer 3 these will be field-encrypted with per-tenant DEK in a follow-up migration when production_surface flips)
    ssn_last4       TEXT,                                -- 4-char synthetic only
    relationship_to_primary TEXT,                        -- 'self', 'spouse', 'child', 'grandchild', 'other'
    is_us_citizen   BOOLEAN,                             -- relevant for QDOT analysis (out-of-scope at MVP but tracked)
    deceased        BOOLEAN NOT NULL DEFAULT FALSE,
    date_of_death   DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT person_dod_requires_deceased CHECK (
        (deceased = FALSE AND date_of_death IS NULL)
        OR (deceased = TRUE AND date_of_death IS NOT NULL)
    )
);
CREATE INDEX persons_household_idx ON persons(tenant_id, household_id);

ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons FORCE ROW LEVEL SECURITY;
CREATE POLICY persons_tenant_isolation ON persons
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- ----------------------------------------------------------------------------
-- ENTITIES — non-natural parties (Trust, LLC, Foundation, etc.)
-- ----------------------------------------------------------------------------
CREATE TYPE entity_type_enum AS ENUM (
    'TRUST_REVOCABLE',
    'TRUST_GRAT',
    'TRUST_DYNASTY',
    'TRUST_OTHER_IRREVOCABLE',
    'LLC',
    'CORPORATION',
    'FOUNDATION',
    'OTHER'
);

CREATE TABLE entities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    household_id    UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,                       -- e.g., "Doe Family Revocable Trust"
    entity_type     entity_type_enum NOT NULL,
    jurisdiction    TEXT,                                -- 2-letter US state for trusts (governs construction)
    created_on      DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX entities_household_idx ON entities(tenant_id, household_id);
CREATE INDEX entities_type_idx ON entities(tenant_id, entity_type);

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities FORCE ROW LEVEL SECURITY;
CREATE POLICY entities_tenant_isolation ON entities
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- ----------------------------------------------------------------------------
-- ROLES — relationship link between Person/Entity and a Trust/Household
-- ----------------------------------------------------------------------------
CREATE TYPE role_type_enum AS ENUM (
    -- Trust roles
    'GRANTOR',
    'TRUSTEE',
    'SUCCESSOR_TRUSTEE',
    'BENEFICIARY',
    'CONTINGENT_BENEFICIARY',
    -- Will/POA roles
    'EXECUTOR',
    'AGENT',
    'GUARDIAN',
    -- Healthcare directive roles
    'HEALTH_CARE_AGENT',
    -- Family/relationship
    'SPOUSE',
    'CHILD',
    'GRANDCHILD',
    'OTHER'
);

CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    household_id    UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    role_type       role_type_enum NOT NULL,
    -- Either person_id OR entity_id is the actor; constrained below.
    person_id       UUID REFERENCES persons(id) ON DELETE CASCADE,
    entity_id_actor UUID REFERENCES entities(id) ON DELETE CASCADE,    -- e.g., trustee can be a corporate entity
    -- Either entity_id_target OR null target (household-level role like 'EXECUTOR' is on the will, not on a specific entity yet)
    entity_id_target UUID REFERENCES entities(id) ON DELETE CASCADE,
    distribution_share NUMERIC(7,4),                                    -- when role_type=BENEFICIARY: fraction 0..1
    contingencies_text TEXT,                                            -- "if predeceased per stirpes to issue", etc.
    starts_at       DATE,
    ends_at         DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT actor_required CHECK (person_id IS NOT NULL OR entity_id_actor IS NOT NULL),
    CONSTRAINT distribution_share_range CHECK (distribution_share IS NULL OR (distribution_share >= 0 AND distribution_share <= 1))
);
CREATE INDEX roles_household_idx ON roles(tenant_id, household_id);
CREATE INDEX roles_target_idx ON roles(tenant_id, entity_id_target) WHERE entity_id_target IS NOT NULL;
CREATE INDEX roles_actor_person_idx ON roles(tenant_id, person_id) WHERE person_id IS NOT NULL;

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles FORCE ROW LEVEL SECURITY;
CREATE POLICY roles_tenant_isolation ON roles
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- ----------------------------------------------------------------------------
-- ASSETS — held by household (directly) or by an entity (in trust)
-- ----------------------------------------------------------------------------
CREATE TYPE asset_class_enum AS ENUM (
    'CASH_DEPOSIT',
    'TAXABLE_BROKERAGE',
    'RETIREMENT_TRADITIONAL',
    'RETIREMENT_ROTH',
    'REAL_PROPERTY_PRIMARY',
    'REAL_PROPERTY_INVESTMENT',
    'PRIVATE_BUSINESS_INTEREST',
    'LIFE_INSURANCE_FACE_VALUE',
    'OTHER'
);

CREATE TABLE assets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    -- entity_id NULL => held by individual within household (titled to a person)
    -- entity_id NOT NULL => held by an entity (e.g., assets in a trust)
    entity_id           UUID REFERENCES entities(id) ON DELETE CASCADE,
    asset_class         asset_class_enum NOT NULL,
    description         TEXT NOT NULL,
    fair_market_value   NUMERIC(18,2) NOT NULL CHECK (fair_market_value >= 0),
    cost_basis          NUMERIC(18,2) CHECK (cost_basis IS NULL OR cost_basis >= 0),
    valuation_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    location_state      TEXT,                              -- for real property
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX assets_household_idx ON assets(tenant_id, household_id);
CREATE INDEX assets_entity_idx ON assets(tenant_id, entity_id) WHERE entity_id IS NOT NULL;

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets FORCE ROW LEVEL SECURITY;
CREATE POLICY assets_tenant_isolation ON assets
    USING (tenant_id = app_current_tenant())
    WITH CHECK (tenant_id = app_current_tenant());

-- Grant CRUD on the new tables to the application role
GRANT SELECT, INSERT, UPDATE, DELETE ON households, persons, entities, roles, assets TO estatecompass_app;

COMMIT;
