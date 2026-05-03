# ADR-T-002 · No Multi-Tenant Isolation, By Design

**Status:** ACCEPTED
**Date:** 2026-05-03
**Run:** RUN-TRANSFER-001
**Deliberately NOT transferred from:** ADR-002 (RUN-WEALTHCOM-001)

## Why this ADR exists at all

A factory that overfits to a prior workload would silently apply ADR-002's three-layer tenant isolation (Postgres RLS + connection-pool wrapper + per-tenant KMS) to TaxBaseline Mini — even though TaxBaseline Mini has exactly one user and zero need for tenant isolation. That blanket application would be theatre: extra complexity, no security gain, factory's own credibility damaged.

This ADR documents the **deliberate non-transfer** so that a reviewer (or a future Claude session resuming this run) cannot mistake the absence of multi-tenant code for an oversight.

## Context

TaxBaseline Mini's archetype per `PRODUCT-TAILORING-TRANSFER-001`:
- Single-user CPA desktop/CLI tool.
- No SaaS surface. No advisor + client hierarchy. No tenant boundary.
- Risk profile: privacy=medium, security=low (vs. wealth.com's privacy=high, security=high).

ADR-002's mitigations were sized for wealth.com's threat model:
- RSK-004 "Multi-tenant data leak between advisor firms" — does not apply (no multi-tenancy).
- Headline-risk insider attack on advisor firm tenancy — does not apply.

If TaxBaseline Mini imported the @estatecompass/db package and required `withTenant(tenantId, ...)` on every query, the user would be the *only* tenant — defeating the point.

## Decision

**TaxBaseline Mini does NOT implement multi-tenant isolation.** Specifically:
- No `tenant_id` column on any (future) data model.
- No Postgres RLS (no Postgres at all at this scope; calculations are stateless functions).
- No KMS / per-tenant KEK (no documents being persisted).
- No `withTenant` wrapper.

This is a **deliberate factory tailoring**, not an oversight. ADR-002 remains correct for wealth.com; it is *inapplicable* here.

## Consequences

### Positive
- **Code is appropriately simple for its archetype.** A single-user CLI tool is not a multi-tenant SaaS, and pretending otherwise is slop.
- **Demonstrates the factory tailors per archetype.** This is the meta-meta evidence: the dark factory does NOT apply ADR-002 to every regulated workload.

### Negative / Cost
- **None at this scope.** If TaxBaseline Mini ever evolves to a multi-user service, the addition of multi-tenant isolation would itself be a new ADR (ADR-T-003), with its own RALPH 5-loop.

## Pattern non-lineage (transfer-test traceability)

| Element | ADR-002 (parent) | ADR-T-002 (this) | Transferred? |
|---|---|---|---|
| RLS on every tenant-scoped table | yes | n/a (no tenants) | ❌ correctly NOT transferred |
| Connection-pool wrapper enforces tenant context | yes | n/a | ❌ correctly NOT transferred |
| Per-tenant KEK envelope encryption | yes | n/a (no document persistence) | ❌ correctly NOT transferred |
| WORM audit log REVOKE UPDATE/DELETE | yes | n/a (no DB) | ❌ correctly NOT transferred |
| Defense-in-depth posture | yes | yes (different concrete controls; e.g., file-permission-based) | ✅ pattern at meta level |

**Test of this non-transfer:** A reviewer should look at TaxBaseline Mini's code and verify the absence of multi-tenant code is intentional. This ADR is the citation for that absence.

## Reactivation triggers

This non-transfer holds while ALL of these remain true:
- Single-user product
- No SaaS / multi-user surface
- No persistent storage of regulated data

If any flips, file ADR-T-003 (or supersede this with a new ADR-T-002) before adding tenant code.

## Trace links

- Parent: `runs/wealth-com/05_artifacts/ADR-002-multi-tenant-isolation.md`
- Source: ATTR-TRANSFER-001 §expert_debate.round_3_synthesis (anti-overfit constraint #2)
- Source: PRODUCT-TAILORING-TRANSFER-001 §risk_profile_rationale_vs_wealthcom.security_low_vs_high
- Implements: anti-overfit rule "factory tailors per archetype, not blanket-applies"
