# Wealth.com Run · `RUN-WEALTHCOM-001`

This directory is the **project book** for a single dark-factory run. It builds an "EstateCompass" clone of wealth.com from the source PRD at `../../wealth_com_PRD_transcript.md`.

## State at this checkpoint (2026-04-26)

- **Stage-0 (attractor / governance / recon):** ✅ COMPLETE
- **Stage-1 (intake interrogation + recursive spec decomposition):** 🟢 UNBLOCKED, kickoff bead `TB-WC-2026-0426-005` queued
- **Stages 2-7 + transfer-test + retro:** queued in `02_attractor/factory-pert-plan.json`
- **Engagement governance:** APPROVED at checkpoint-#1 (`02_attractor/checkpoint-1-approval-record.json`)
- **Hawkeye verdict:** CONDITIONAL_PASS (`12_hawkeye/hawkeye-stage0-independent.json`)

## Operating ledger

`TASKS.md` is the authoritative bead ledger. Read it FIRST when resuming.

## Directory map

```
00_recon/         skill-system survey · PRD atomization (212 atoms) · self-grep verification
01_domain/        domain brief (827 lines, 165 citations) · critical-findings summary (FACT-OBBBA-001 etc.)
02_attractor/     12 governance records + checkpoint-1-approval-record
03_governance/    engagement-governance-record (APPROVED)
04_intake/        empty — Stage-1 lands here
05_artifacts/     empty — Stage-3+ artifact factory outputs
06_methodology/   empty — methodology blend record
07_swarm/         empty — expert debate + AI judge/jury per-transition records
08_refinery/      empty — RALPH 5-loop records + refinery gate records + quality certificates
09_traceability/  knowledge graph seed (30 nodes, 24 edges)
10_production/    deferred — production_surface=false at v0
11_feedback/      INC-001 slop incident record + lessons L-001/L-002/L-003
12_hawkeye/       conformance audits (self pre-audit + binding independent + patch bead)
app/              empty — code lands here at Stage-6 Construction
```

## Key atoms / records to read first

| If you want to know... | Read this |
|---|---|
| ...what we're building and why | `02_attractor/meta-attractor-record.json` (40KB, the most context-loaded record) |
| ...what the PRD actually says | `00_recon/prd-canonical.md` + `00_recon/prd-atoms.json` |
| ...domain context (estate tax, OBBBA, trust strategies) | `01_domain/domain-brief.md` |
| ...findings that change project context | `01_domain/critical-findings-summary.md` |
| ...current and next bead | `TASKS.md` |
| ...legal next action | `02_attractor/next-action-report.json` |
| ...client decisions at checkpoint | `02_attractor/checkpoint-1-approval-record.json` |
| ...what the audit found | `12_hawkeye/hawkeye-stage0-independent.json` |
| ...why we caught a slop event | `11_feedback/incident-INC-001-prd-agent-slop.json` |

## Resume protocol

Per `df-context-memory` rules:
1. Load `TASKS.md` — find active bead.
2. Load `02_attractor/execution-kernel-state.json` — confirm legal next action.
3. Load `02_attractor/tpm-flow-ledger.json` and `factory-pert-plan.json` — confirm what's next, what's blocking.
4. Load only the child skill needed for the current step.
5. Never resume from chat memory.
