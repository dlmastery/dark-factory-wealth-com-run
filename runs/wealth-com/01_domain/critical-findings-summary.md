# Domain Research — Critical Findings Summary

**Run:** RUN-WEALTHCOM-001
**Date:** 2026-04-26
**Source:** `runs/wealth-com/01_domain/domain-brief.md` (827 lines, 165 citations)
**Audience:** client_owner (checkpoint-#1 input) + downstream stages

This file flags findings that **materially change** prior assumptions in `meta-attractor-record.json`, the PRD, or the engagement governance scope. Each finding has an explicit action item.

---

## FINDING #1 [P0 SCOPE-IMPACT] — TCJA sunset was REPEALED. Federal exemption is permanently $15M.

**Discovery:** The "One Big Beautiful Bill Act" (OBBBA) was signed July 4, 2025 and **permanently raised** the federal estate / gift / GST exemption to $15M (2026), with annual inflation adjustment. The TCJA sunset that was scheduled for 12/31/2025 **did not happen** — the law was modified before it triggered.

**Why this matters:**
- The PRD heavily models "2026 TCJA sunset to ~$7M" as Wealth.com's primary tax-planning use case (Scenario Builder, Tax Planning surface, urgent SLAT/GRAT funding before year-end).
- My `meta-attractor-record.json` ASM-003 stated this as an assumption. ASM-003 is now **INVALIDATED**.
- Wealth.com itself almost certainly already updated its product post-July 2025 — but the PRD transcript (which is a Grok-authored speculative spec, dated 2026-04-25) may not reflect this. The `prd-extraction-report.json §uncertainty_log` already noted some PRD content felt aspirational/speculative.
- The Scenario Builder's primary "rush before sunset" framing shifts to "optimize at the new $15M permanent base + plan for $30M married couple exemption."

**Action items:**
1. **HD-001 amendment opportunity:** Client may want to confirm whether the clone should model (a) the world as the PRD describes it (TCJA-sunset framing — historical artifact), (b) the actual current law (OBBBA $15M permanent), or (c) both, with a feature flag. Default proposal: **(b) actual current law** — building software against repealed law is slop.
2. **Update ASM-003** in `meta-attractor-record.json` from "TCJA sunset to ~$7M" to "OBBBA permanent $15M (2026)" once client confirms.
3. **Scenario Builder priority shift:** GRAT laddering, SLAT, Dynasty Trust still valuable at $15M base — but the urgency narrative changes. New scenarios to add: "use exemption now even though permanent" cost-of-delay; "$15M+ HNW segment optimization" instead of "rush before sunset".
4. **Tax Planning calculations:** Federal estate-tax bracket math unchanged (still 40% top rate); only the exclusion threshold changed. Update golden-dataset to OBBBA values.

**Source:** Domain brief §1 (US Estate & Gift Tax Landscape) — multiple primary citations to IRS and law firm publications.

---

## FINDING #2 [P1 SCOPE-IMPACT] — State-level changes (NYDFS Part 500, CCPA/CPRA ADMT, MT/CT GLBA)

**Discoveries:**
- **NYDFS Part 500** final amendments effective **Nov 1, 2025**; first compliance certification due **April 15, 2026** (already past for production deployments). Universal MFA mandatory; Asset Inventory Program required.
- **CCPA/CPRA** July 2025 final regulations add **ADMT (Automated Decision-Making Technology) rules** effective **Jan 1, 2027** — affects AI-driven recommendations like Ester's tax/estate suggestions.
- **Montana and Connecticut** eliminated the **GLBA entity-level exemption** in 2025 — fintechs holding consumer financial data in those states must now comply with state privacy laws on top of GLBA.

**Why this matters:**
- Architecture / Threat Model (ARC-005) must include NYDFS Part 500 as a control basis if any tenant operates in NY (likely given RIA market geography).
- The ADMT rules affect any "AI-generated recommendation" surface — Ester's tax-strategy suggestions, Scenario Builder outputs, document creation. Need to add: ADMT consumer-rights handling (transparency, opt-out, human review).
- Compliance posture for state-by-state was named "GLBA + CCPA/CPRA" in `engagement-governance-record.json`. Now needs NY DFS Part 500 + state-level GLBA-eliminated handling.

**Action items:**
1. Update `engagement-governance-record.json §standards_baseline` to add **NYDFS Part 500** (effective 2025-11-01).
2. Update `product-tailoring-profile.json §risk_profile.compliance` rationale to include ADMT and state-level changes.
3. Architecture/Threat Model (deferred to Stage-4) must explicitly cover ADMT consumer-rights flows.

---

## FINDING #3 [P1 EVIDENCE] — Wealth.com Series B investor list reconciliation

**Discovery:**
- Domain brief verified Series B: **Schwab led**, **$65M**, **April 16, 2026**. New investors: **Titanium Ventures, Pruven Capital, The K Fund, Dynasty Financial Partners**. Existing investors continuing: **GV, Citi Ventures, 53 Stations, Anthos, Alumni Ventures**.
- The **artifacts catalog** I pulled into context originally listed "Brewer Lane Ventures" as one of the Series B participants. Domain research **could not substantiate** Brewer Lane in any 2026 source.
- The **PRD-extraction self-grep** earlier verified "Titanium Ventures, Pruven Capital, The K Fund" with 5 grep matches in the PRD itself — consistent with domain finding.

**Why this matters:**
- The original `wealth_com_PRD_artifacts.md` may itself contain a slop or stale entry. This is a triple-source reconciliation: (artifacts says X), (PRD says Y), (web research says Y). Y is the verified set.
- For our clone, this is **product context only** (we are not modeling investor relations); but the lesson is to NOT trust any single source — even a "live capture" artifacts catalog.

**Action items:**
1. Add lesson L-002: "Even live-capture artifacts catalogs can contain stale/erroneous entries. Cross-source reconciliation required for any factual claim used in product reasoning."
2. No changes to product scope. Investor list is product context only.

---

## FINDING #4 [P2 EVIDENCE] — "Eve (Income Lab)" competitor was misnomer in my research prompt

**Discovery:** I prompted the domain agent to research "Eve (Income Lab)" as a competitor. Income Lab is real but does **retirement-income** modeling, not estate planning. No product named "Eve" surfaces. This was a hallucinated entity in MY prompt to the subagent.

**Why this matters:** Even my prompts can carry slop. Good catch by the domain agent.

**Action items:**
1. Remove "Eve (Income Lab)" from competitor list in `product-tailoring-profile.json` (no occurrence to remove — was only in research prompt, not in production records). No file change needed; just note for retrospective.
2. Lesson L-003: "Orchestrator prompts to subagents must not invent specifics. Cite sources or mark as 'check whether this exists.'"

---

## FINDING #5 [P2 ARCHITECTURE-CONFIRMATION] — "1,000 deterministic calculations per estate" pattern confirmed

**Discovery:** The PRD's "1,000 deterministic calculations per estate" claim corresponds to a real industry pattern: **extract → compute → narrate**. LLM extracts structured facts from documents; a deterministic Python/JS engine executes tax/legal computations with audit trail; LLM is used only for narration of results.

**Why this matters:** This is the architectural ADR I had already locked in `meta-attractor-record.json §non_negotiable_constraints_locked_in`. Domain research **confirms** this is the right architectural direction — not Wealth.com's invention, but the canonical pattern in regulated AI.

**Action items:** No changes; lock the ADR more firmly. This finding strengthens the deterministic-calc-separation refusal rule in `generated-meta-skill-contract.json §refusal_rules`.

---

## FINDING #6 [P3 ECOSYSTEM] — Yodlee sold by Envestnet to STG in 2025

**Discovery:** Yodlee was sold by Envestnet to Symphony Technology Group (STG) in 2025 — independent ownership now.

**Why this matters:** Integration adapter for Yodlee may have changed APIs / business terms. Treat as a partner-relationship-changed flag.

**Action items:** Note in integration adapter design (Stage-4 architecture). Default to mock at v0 anyway, so low impact.

---

## Top 5 Research Priorities for Stage-1 Intake (per domain agent)

1. **OBBBA detailed clauses** affecting trust strategies — what changed beyond exemption amount?
2. **State-by-state NYDFS Part 500 equivalents** — which other states adopted similar rules?
3. **CCPA/CPRA ADMT regulations final text** — for AI-driven recommendation transparency requirements.
4. **Wealth.com's actual post-2025 product positioning** — they almost certainly pivoted Scenario Builder framing post-OBBBA; verify via fresh website capture.
5. **Verify "1,000 deterministic calculations per estate" claim** — is it 1,000 *types* of calc, or 1,000 *executions* per estate? Architectural ramification.

---

## Closure on Hawkeye F-002

**Hawkeye Stage-0 finding F-002 (P1):** "Domain brief still missing — must be obtained before checkpoint-#1 client approval is fully informed."

**Status:** **CLOSED.** Domain brief written to `runs/wealth-com/01_domain/domain-brief.md` (827 lines, 165 citations). This summary file surfaces the critical findings to the orchestrator and client.

**Patch bead `TB-WC-2026-0426-PATCH-001` updated:** F-002 moved from `patches_pending` to closed.
