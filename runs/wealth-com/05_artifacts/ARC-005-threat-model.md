# ARC-005 · Threat Model — EstateCompass Demo MVP

**Status:** ACCEPTED (initial — RALPH 5-loop forthcoming)
**Date:** 2026-05-03
**Run:** RUN-WEALTHCOM-001
**Method:** STRIDE (Microsoft) + LINDDUN (KU Leuven, privacy) + AI-specific
**Scope:** Slices 1-9 of CC-001 Demo MVP scope. Production-surface threats are out-of-scope (production_surface=false at v0; threats reactivate when surface flag flips).

This artifact decomposes the EstateCompass attack surface against the seven bounded contexts in `HLD-001` and maps each threat to a mitigation already implemented or explicitly waived. Residual risks are preserved.

---

## 1. Trust boundaries

```
                 (untrusted)                          (semi-trusted)        (trusted)
   advisor browser  →  api  →  calc-engine
                            →  ai-extract  →  Anthropic Claude  (3rd-party LLM)
                            →  postgres
                            →  kms-substitute
                            →  blob-store
                            →  audit-log (append-only)
```

**Five trust boundaries** in scope:
1. Browser ↔ api (HTTPS in production posture; HTTP local-only at v0).
2. api ↔ calc-engine (intra-cluster; mTLS in production posture).
3. api ↔ ai-extract (intra-cluster).
4. ai-extract ↔ Anthropic Claude (egress over HTTPS; **content boundary** — document plaintext crosses here).
5. api ↔ Postgres (RLS-enforced; non-superuser application role).

**Highest-risk boundary at v0:** #4. Document plaintext leaves the system to a third-party LLM. Mitigation: synthetic data only (HD-008); production posture would require a private model gateway and BAA.

---

## 2. STRIDE — per bounded context

### 2.1 Identity & Tenancy

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-IT-1 | JWT secret leakage → forged advisor identity | Spoofing | high | Slice-1 config refuses to start in production with default JWT_SECRET; production posture rotates secret + uses asymmetric signing | Symmetric secret in v0 — accepted given local-only |
| T-IT-2 | Weak password → credential stuffing | Spoofing | medium | argon2id hash; MFA-stub at v0; production posture requires real MFA per NYDFS Part 500 | MFA not enforced at v0 — documented |
| T-IT-3 | Replay of stolen JWT after user signs out | Spoofing | medium | Short-lived access JWT (15m default); refresh-token revocation forthcoming | Slice-1 refresh-token flow not implemented at v0 — patch bead queued |
| T-IT-4 | Privilege escalation: read_only user invokes admin endpoint | Elevation | high | requireRole decorator checks at handler level; roleAtLeast helper in auth.ts; 4 unit tests cover the hierarchy | Server-side defense-in-depth pending: rate-limit role-mismatch responses to slow probing |
| T-IT-5 | JWT contains tampered tenant_id claim | Tampering | critical | JWT signature verification rejects modified payload before tenant-context plugin runs | None |

### 2.2 Household / Person / Entity / Asset

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-HH-1 | Cross-tenant household read via direct ID guess | Information disclosure | critical | Postgres RLS USING (tenant_id = app_current_tenant()) — physical impossibility, not best-effort. 4 DB-required tests in Slice-2; recurring Hawkeye test attacks this | None — primary defense |
| T-HH-2 | Cross-tenant household write via crafted INSERT | Tampering | critical | RLS WITH CHECK (tenant_id = app_current_tenant()) — INSERT with foreign tenant_id is rejected at DB; 1 dedicated test in tenant-isolation.test.ts | None |
| T-HH-3 | IDOR: GET /v1/households/{id} where id belongs to other tenant | Information disclosure | high | Same as T-HH-1; 404 not 403 to avoid existence leak | None |
| T-HH-4 | Synthetic seed pollution: production data accidentally re-runs the demo seed | Tampering | medium | seed migration explicitly comments "synthetic only HD-008"; production posture excludes 0005_seed_demo.sql from migration set | Operational discipline required |
| T-HH-5 | Asset value injection: negative or NaN FMV breaks calc | Tampering | medium | CHECK (fair_market_value >= 0) at DB; calc-engine rejects NaN/inf at validation | None |

### 2.3 Document Vault

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-DV-1 | Plaintext document persisted to disk | Information disclosure | critical | Plaintext is encrypted via @estatecompass/kms BEFORE reaching blob storage; LocalBlobStore sees ciphertext only; 7 KMS unit tests prove the contract | Operator gains plaintext during ai-extract call (T-AI-1 below) |
| T-DV-2 | Stolen ciphertext decrypted offline | Information disclosure | high | Per-tenant KEK + per-document DEK envelope encryption (AES-256-GCM); without the KEK, encrypted DEK is useless | KEK compromise = catastrophic; production posture uses HSM-backed KMS |
| T-DV-3 | Tampered ciphertext → controlled plaintext returned | Tampering | high | AES-256-GCM auth tag fails on tamper; sha256_plaintext compared on decrypt — 2-layer detection; 1 test for each layer | None |
| T-DV-4 | Cross-tenant DEK reuse | Information disclosure | high | DEK is per-document; cross-tenant decrypt fails because KEK is per-tenant; 1 test (`tenant A's KEK does not decrypt tenant B's DEK`) | None |
| T-DV-5 | Tenant offboarding: data must be unrecoverable | Compliance | high | deleteKek() crypto-shreds; all encrypted DEKs become unusable; 1 test (rotated passphrase makes encrypted DEK undecryptable) | LocalSubstituteKms passphrase is shared across tenants; production posture has per-tenant key isolation |
| T-DV-6 | DoS via 1000s of huge document uploads | DoS | medium | 50MB ceiling at api boundary; rate-limiting deferred to production posture | v0 single-tenant demo — accepted |

### 2.4 Sage Extraction (AI/ML — most novel attack surface)

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-AI-1 | Prompt injection in uploaded document → exfiltrate other facts or bypass refusal honesty | Tampering / Information disclosure | high | (1) Structured output (Anthropic tool-use schema) constrains response to JSON, mitigating freeform injection. (2) Grounding validator (Slice-4, 8 unit tests) rejects facts whose source_excerpt isn't verbatim in document — limits "make up a fact" injection. (3) System prompt explicit refusal-honesty instructions. (4) Confidence-tier floor for attorney_review_required. | Adversarial document with carefully-crafted excerpts that ARE in the document but are misleading interpretations — mitigated only by attorney review |
| T-AI-2 | Hallucinated calculation in narrative output | Tampering | critical | ADR-001 forbids LLM arithmetic; calc-engine has no LLM dependency; 24+14 golden tests assert determinism. Narrative LLM output cites rule_id; mismatch triggers rejection | Adversarial chain attack: model outputs convincing but wrong rule_id citation — mitigated by deterministic mapping in caller (api routes do not let LLM choose the rule) |
| T-AI-3 | Excerpt-hash forgery to fake provenance | Tampering | high | Grounding validator recomputes sha256 server-side; mismatch with emitted hash triggers tier downgrade. 1 dedicated tamper-detection test | Producer-side spoofing where producer is the model itself: addressed by 'recompute, do not trust emitted hash' rule |
| T-AI-4 | Confidence score manipulation: model lies about its confidence | Tampering / Information disclosure | medium | Calibration test in eval harness empirically checks confidence vs accuracy on holdout; deviation triggers re-tier policy. attorney_review_required floor at medium tier limits damage | Calibration drift between holdout dataset and production — periodic re-evaluation required |
| T-AI-5 | Model exfiltration via document content (model memorized PII it shouldn't have) | Privacy | medium | (1) Synthetic data only at v0 — no real PII to exfiltrate. (2) ADR-003 mandates holdout from public corpora, not PRD examples. (3) Anthropic's zero-data-retention private endpoints (production posture). | At v0 the holdout dataset acquisition is OQ-INTAKE-005 open question; until closed, holdout integrity unverified |
| T-AI-6 | Adversarial document crafted to crash the grounding validator (e.g., enormous excerpt, regex pathological input) | DoS | low | source_excerpt schema-bounded ≤300 chars; grounding validator uses simple `.includes()`, not regex; load-bearing substring fixed at 60 chars | None significant |
| T-AI-7 | Inference-side data leak: ai-extract logs full document text in error path | Privacy | medium | Pino structured logging configured to redact `document_text` field; production posture would add a DLP scan | Reviewed at Slice-4 RALPH; logging redaction not yet implemented — patch bead queued |

### 2.5 Calculations

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-CA-1 | Out-of-date OBBBA constant after legislative change | Compliance | high | RULE_ID + computation_version stamped on every output; future law changes create a NEW rule file (RULE-FET-{NEW}-YYYY) — never mutate; OBBBA regression alert test (Slice-6) would catch silent reversion | Operational discipline: must monitor §7520 rate + tax law changes |
| T-CA-2 | Float arithmetic surprise on cents | Tampering / Compliance | medium | Decimal/ROUND_HALF_EVEN throughout; Float types are linted out (production posture would add ESLint rule); 22 OBBBA + 14 GRAT golden tests cover boundary cases | None |
| T-CA-3 | Invalid rule_id passed by caller → silent default | Tampering | medium | calc-engine routes are explicit about rule selection; no dynamic dispatch by string; 4 unit tests cover schema-mismatch rejection on the api↔calc client | None |

### 2.6 Audit Log

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-AL-1 | Insider deletes audit row to cover tracks | Repudiation | critical | REVOKE UPDATE/DELETE/TRUNCATE on audit_log from estatecompass_app role (migration 0003_audit_log_lockdown.sql); only out-of-band estatecompass_audit_admin role can write outside append; 1 DB-required test attempts UPDATE+DELETE → permission denied | DBA with superuser still can; production posture writes to S3 Object Lock immediately (FINRA 17a-4 compliant) |
| T-AL-2 | Audit log floods storage → DoS | DoS | low | Append-only rows are tiny (~200 bytes); 7-year retention plan; production posture archives to immutable storage | None significant |
| T-AL-3 | Audit-log RLS bypass: tenant A reads tenant B's audit | Information disclosure | high | audit_log has tenant_isolation policy USING (tenant_id = app_current_tenant()); same RLS posture as other tables | None |

### 2.7 Integration Adapters (Slice-8, partial at v0)

| ID | Threat | Category | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| T-IN-1 | Spoofed Plaid/Schwab webhook injects synthetic positions | Tampering | high | At v0, only contract+mock — no real partner traffic; production posture verifies signed webhooks with rotated secrets | Not applicable at v0 |
| T-IN-2 | SSRF via webhook URL config | Information disclosure | high | Outbound URLs constrained to allowlist in production posture; localhost/private-IP rejected | Deferred to production_surface=true |

---

## 3. LINDDUN — privacy-specific threats

LINDDUN is targeted at GDPR/CCPA/HIPAA-style privacy obligations. EstateCompass has PII (SSN, DOB, addresses), PHI (Advance Health Care Directive content — deferred from MVP per CC-001), and financial detail (asset inventories, beneficiary designations).

| ID | Threat | LINDDUN axis | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| L-1 | Linkability: same household across tenants via name match | Linkability | medium | Tenant isolation prevents cross-tenant queries; advisors cannot enumerate other tenants' households | Aggregate analytics across tenants (not in MVP) would require differential privacy |
| L-2 | Identifiability: synthetic data accidentally close to real person | Identifiability | low | Synthetic seeds use clearly fictional names (Doe Family); HD-008 disallows real PII | None |
| L-3 | Non-repudiation: advisor cannot deny accessing a client document | Non-repudiation | n/a (positive) | audit_log captures every authenticated request → required posture, not threat | None — by design |
| L-4 | Detectability: side-channel reveals whether a tenant has documents | Detectability | low | List endpoints scoped by RLS; cross-tenant existence not observable | None significant |
| L-5 | Disclosure of information (DI): ai-extract sends document plaintext to Anthropic | Disclosure | high | Synthetic data only at v0 (HD-008); production posture would use a private-model gateway with zero-data-retention contract + BAA when PHI present | Production-surface gate WAIVER-001 covers this |
| L-6 | Unawareness: client does not know advisor uploaded their document to AI | Unawareness | medium | UPL handling per HD-007 + Disclaimer (FR-UI-DISCLAIMER-001) on every screen surfaces "informational summaries". v2 posture: client portal with audit visibility. | Client portal deferred per CC-001 |
| L-7 | Non-compliance with CCPA/CPRA ADMT (effective 2027-01-01) | Non-compliance | medium | Recorded as FACT-ADMT-CCPA-2027 in meta-attractor; mitigations include Sage transparency UI (confidence tiers + provenance excerpt visible) and human-review routing for attorney_review_required | Full ADMT consumer-rights flow (opt-out, human review on demand) deferred to production posture |
| L-8 | Non-compliance with NYDFS Part 500 (effective 2025-11-01) | Non-compliance | high (when NY tenant) | Universal MFA + asset-inventory program required. v0 has MFA-stub; production posture would enforce MFA per role+tenant configuration. | Real-MFA enforcement deferred to production posture |

---

## 4. AI-specific systemic risks

These are NOT individual threats but emergent properties of the AI-extract surface:

| ID | Risk | Mitigation in scope | Open |
|---|---|---|---|
| AI-S-1 | Model regressions degrade extraction accuracy without alarm | Calibration test in eval harness; confidence-distribution drift monitoring (production posture); model-version pinning in extracted_facts row | Drift monitoring not implemented at v0 |
| AI-S-2 | Anthropic API outage → demo unavailable | Circuit breaker + degrade-to-mock for v0; production posture: dual-provider failover (FACT-AI-PROVIDER-DUAL pending) | Deferred |
| AI-S-3 | Cost runaway via untrusted advisor uploading 100s of documents | Per-tenant budget meter at api boundary; per-day extraction count limit | Deferred to production_surface posture |
| AI-S-4 | Prompt-template drift between sage and golden-test prompts | Prompts versioned in `apps/ai-extract/prompts/` with explicit prompt_version stamped on extracted_facts row (production posture); MockGroundedExtractor pinned for v0 demo | Real Claude prompt version pinning is OQ for Slice-4 Claude integration |

---

## 5. Mapping to existing risks (ATTR-WEALTHCOM-001 §risks)

| ATTR Risk | ARC-005 threats addressing it |
|---|---|
| RSK-001 (AI hallucination on legal docs → fiduciary harm) | T-AI-1, T-AI-2, T-AI-3, T-AI-4, T-AI-7, AI-S-1 |
| RSK-002 (Tax calc error → IRS penalty) | T-CA-1, T-CA-2, T-CA-3 |
| RSK-003 (UPL — generated outputs as legal advice) | L-6 + Disclaimer mitigation; CC-001 deferral of Document Creation surface eliminates the worst path |
| RSK-004 (Multi-tenant data leak) | T-IT-5, T-HH-1, T-HH-2, T-HH-3, T-DV-4, T-AL-3 |
| RSK-005 (Factory overfit) | n/a (process risk; addressed by transfer-test bead, not a runtime threat) |
| RSK-006 (Token spend overrun) | AI-S-3 |
| RSK-007 (Brand IP infringement) | n/a (legal/process; brand-substitution CI gate) |
| RSK-008 (Multi-day context loss) | n/a (process; df-context-memory) |
| RSK-009 (PHI in HCDs — HIPAA) | L-5 (deferred; HCDs out of MVP scope) |
| RSK-010 (PRD claims become unverified requirements) | n/a (process; L-001 + atom-provenance protocol) |

---

## 6. Top 10 P0/P1 threats — defended in code

For each, the test that would catch a regression:

1. **T-IT-5** JWT tenant_id tampering → `apps/api/src/plugins/auth.test.ts` (JWT signature verification) + RLS will reject tampered claim downstream.
2. **T-HH-1/2/3** RLS bypass → `packages/db/tests/integration/tenant-isolation.test.ts` (cross-tenant SELECT returns 0 rows; INSERT with foreign tenant fails WITH CHECK).
3. **T-DV-1** plaintext on disk → `packages/kms/src/index.test.ts` (encrypt before storage; ciphertext-only tests).
4. **T-DV-3** ciphertext tampering → `packages/kms/src/index.test.ts` byte-flip + sha256-mismatch tests.
5. **T-DV-5** crypto-shred → `packages/kms/src/index.test.ts` rotated-passphrase test.
6. **T-AI-1/3** ungrounded fact / forged provenance → `apps/ai-extract/tests/test_grounding_validator.py` (8 cases including tamper).
7. **T-AI-2** LLM arithmetic → ADR-001 + calc-engine has no Anthropic SDK in dependencies (`apps/calc-engine/pyproject.toml` lacks `anthropic`); 22+14 golden tests assert determinism.
8. **T-CA-1** OBBBA regression → Slice-6 OBBBA-regression-alert test in `test_grat_remainder.py::test_grat_scenario_uses_obbba_exemption`.
9. **T-AL-1** audit-log tamper → `tenant-isolation.test.ts::audit_log INSERT works under tenant context; UPDATE and DELETE do not`.
10. **T-IT-4** privilege escalation → `apps/api/src/plugins/auth.test.ts::roleAtLeast` 4 cases.

---

## 7. Deferred / waived threats

| ID | Reason | Waiver owner | Re-activation trigger |
|---|---|---|---|
| T-IT-3 (refresh-token revocation) | Slice-1 v0 has access-token-only flow | claude-orchestrator | First refresh-token attempt fails noisily; patch bead created |
| T-AI-7 (logging redaction) | Identified during this threat-modeling pass | claude-orchestrator | Slice-4 RALPH 5-loop record |
| T-IN-1, T-IN-2 (Plaid/Schwab webhook spoof + SSRF) | Real partner integration deferred per CC-001 | client_owner via WAIVER-001 | production_surface=true |
| L-5 (document plaintext to Anthropic) | Synthetic data only per HD-008 | client_owner | First real-PII flag |
| L-7, L-8 (ADMT, NYDFS Part 500) | Production posture only | client_owner via WAIVER-001 | production_surface=true with NY tenant |

---

## 8. Adversarial review (RALPH adversarial critic role)

A red-team review of this threat model itself should attempt to:

1. **Find a STRIDE category we missed.** ✓ Repudiation considered (T-AL-1); audit log captures every action.
2. **Find a bounded context we didn't analyze.** ✓ All 7 from HLD-001 covered.
3. **Show a mitigation that's claimed but not actually in code.** Self-check: every "mitigation" in §2 cites a specific file or test. RALPH 5-loop must grep-verify each citation resolves.
4. **Show a residual risk that should have been a P1.** Adversarial-document-with-misleading-but-grounded-excerpts is the most subtle — only attorney review catches it. Documented as residual on T-AI-1.
5. **Show overlap with HD/CC items.** Cross-referenced in §5.

This artifact requires the RALPH 5-loop record before stage-exit per `df-quality-refinery`. The 5 loops will (1) review-score the 18 artifact-level checks for Threat Model artifact class, (2) attack with anti-slop + failure-mode critics, (3) capture root causes, (4) patch findings, (5) harden re-validate.

---

## 9. Trace links

- Source: ATTR-WEALTHCOM-001 §risks; HLD-001 §6 cross-cutting + §12 STRIDE summary; spec-decomposition-record.json NFR + RULE leaves; domain-brief.md §9 (security/compliance baseline)
- Implements: ADR-001 (T-AI-2, T-CA-*), ADR-002 (T-IT-5, T-HH-*, T-DV-*, T-AL-*), ADR-003 (T-AI-1, T-AI-3, T-AI-4)
- Verified by: Slices 1/2/3/4/5/6 test suites listed in §6; Hawkeye recurring conformance audits; transfer-test on a different fintech surface (`TB-WC-2026-0508-021`)
- Refines into: per-slice RALPH 5-loop records + the final Hawkeye audit
