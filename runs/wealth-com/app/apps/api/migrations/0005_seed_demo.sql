-- 0005_seed_demo.sql — synthetic demo data per HD-008 (no real PII).
--
-- This seed creates two tenants and one $20M household per CC-001 §scenario
-- ("GRAT vs do-nothing for a $20M household"). All names, dates, SSNs are
-- explicitly fictional. The seed is loaded by docker-compose on first start
-- via the migrations volume mount.
--
-- DEMO TENANT: 'Acme RIA'  (slug: acme-ria)
-- DEMO HOUSEHOLD: 'Doe Family' — primary John Doe (alive), spouse Jane Doe (alive),
--   2 children (Sam Doe, Sara Doe). Total $20M assets across cash, brokerage,
--   primary residence, retirement.

BEGIN;

-- Two tenants for cross-tenant testing
INSERT INTO tenants (id, name, slug, kek_ref, status) VALUES
    ('00000000-0000-4000-8000-000000000a01', 'Acme RIA',           'acme-ria',          'kek-local-acme',     'active'),
    ('00000000-0000-4000-8000-000000000a02', 'Bedrock Wealth',     'bedrock-wealth',    'kek-local-bedrock',  'active');

-- Users — synthetic password hashes (placeholder argon2id of "synthetic-pwd")
-- The real Slice-1 auth handler will replace these with a deterministic seed.
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, mfa_enrolled) VALUES
    ('00000000-0000-4000-8000-000000000b01',
     '00000000-0000-4000-8000-000000000a01',
     'advisor@acme-ria.demo',
     '$argon2id$placeholder$synthetic',
     'Alex Advisor',
     'advisor',
     FALSE),
    ('00000000-0000-4000-8000-000000000b02',
     '00000000-0000-4000-8000-000000000a02',
     'advisor@bedrock-wealth.demo',
     '$argon2id$placeholder$synthetic',
     'Bobbi Bedrock',
     'advisor',
     FALSE);

-- Tenant-context required for the household-and-below inserts because of
-- WITH CHECK on RLS policies. Set local for this transaction.
SELECT set_config('app.tenant_id', '00000000-0000-4000-8000-000000000a01', true);

-- Household: Doe Family ($20M MVP demo target)
INSERT INTO households (id, tenant_id, display_name, primary_residence_state, notes) VALUES
    ('00000000-0000-4000-8000-000000000c01',
     '00000000-0000-4000-8000-000000000a01',
     'Doe Family',
     'AZ',
     'Synthetic demo household for MVP scenario. ~$20M net worth. AZ resident (no state estate tax).');

-- Persons
INSERT INTO persons (id, tenant_id, household_id, full_name, date_of_birth, relationship_to_primary, is_us_citizen) VALUES
    ('00000000-0000-4000-8000-000000000d01',
     '00000000-0000-4000-8000-000000000a01',
     '00000000-0000-4000-8000-000000000c01',
     'John Doe',
     '1965-04-15',
     'self',
     TRUE),
    ('00000000-0000-4000-8000-000000000d02',
     '00000000-0000-4000-8000-000000000a01',
     '00000000-0000-4000-8000-000000000c01',
     'Jane Doe',
     '1967-09-22',
     'spouse',
     TRUE),
    ('00000000-0000-4000-8000-000000000d03',
     '00000000-0000-4000-8000-000000000a01',
     '00000000-0000-4000-8000-000000000c01',
     'Sam Doe',
     '1995-06-10',
     'child',
     TRUE),
    ('00000000-0000-4000-8000-000000000d04',
     '00000000-0000-4000-8000-000000000a01',
     '00000000-0000-4000-8000-000000000c01',
     'Sara Doe',
     '1998-11-03',
     'child',
     TRUE);

-- Entity: Doe Family Revocable Trust (placeholder — Slice-4 extracts from documents into entity refinement)
INSERT INTO entities (id, tenant_id, household_id, name, entity_type, jurisdiction, created_on) VALUES
    ('00000000-0000-4000-8000-000000000e01',
     '00000000-0000-4000-8000-000000000a01',
     '00000000-0000-4000-8000-000000000c01',
     'Doe Family Revocable Trust',
     'TRUST_REVOCABLE',
     'AZ',
     '2018-05-01');

-- Roles: John & Jane are co-grantors, co-trustees of the revocable trust.
-- Sam and Sara are equal beneficiaries.
INSERT INTO roles (tenant_id, household_id, role_type, person_id, entity_id_target, distribution_share) VALUES
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', 'GRANTOR',  '00000000-0000-4000-8000-000000000d01', '00000000-0000-4000-8000-000000000e01', NULL),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', 'GRANTOR',  '00000000-0000-4000-8000-000000000d02', '00000000-0000-4000-8000-000000000e01', NULL),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', 'TRUSTEE',  '00000000-0000-4000-8000-000000000d01', '00000000-0000-4000-8000-000000000e01', NULL),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', 'TRUSTEE',  '00000000-0000-4000-8000-000000000d02', '00000000-0000-4000-8000-000000000e01', NULL),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', 'BENEFICIARY', '00000000-0000-4000-8000-000000000d03', '00000000-0000-4000-8000-000000000e01', 0.5),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', 'BENEFICIARY', '00000000-0000-4000-8000-000000000d04', '00000000-0000-4000-8000-000000000e01', 0.5);

-- Assets — sum to $20M for the GRAT-vs-do-nothing scenario:
--   Cash/brokerage (titled jointly to John+Jane, not in the trust):  $4M
--   Primary residence (jointly held):                                 $3M
--   Retirement (Roth, John):                                          $2M
--   Trust-held diversified portfolio:                                $11M
INSERT INTO assets (tenant_id, household_id, entity_id, asset_class, description, fair_market_value, cost_basis, location_state) VALUES
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', NULL,
     'CASH_DEPOSIT',
     'Joint Schwab brokerage cash sweep + checking',
     1500000, 1500000, 'AZ'),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', NULL,
     'TAXABLE_BROKERAGE',
     'Joint Schwab brokerage — public equities/ETFs',
     2500000, 1100000, 'AZ'),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', NULL,
     'REAL_PROPERTY_PRIMARY',
     'Primary residence Phoenix AZ (joint title, right of survivorship)',
     3000000, 950000, 'AZ'),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', NULL,
     'RETIREMENT_ROTH',
     'John Doe Roth IRA (Schwab)',
     2000000, NULL, 'AZ'),
    ('00000000-0000-4000-8000-000000000a01', '00000000-0000-4000-8000-000000000c01', '00000000-0000-4000-8000-000000000e01',
     'TAXABLE_BROKERAGE',
     'Doe Family Revocable Trust — diversified Schwab portfolio',
     11000000, 6500000, 'AZ');

-- Bedrock tenant — minimal seed so cross-tenant tests have at least one row to fail to read
SELECT set_config('app.tenant_id', '00000000-0000-4000-8000-000000000a02', true);
INSERT INTO households (tenant_id, display_name, primary_residence_state, notes) VALUES
    ('00000000-0000-4000-8000-000000000a02', 'Test Household — Bedrock', 'WA',
     'Synthetic demo household belonging to a DIFFERENT tenant; used by cross-tenant isolation tests.');

COMMIT;
