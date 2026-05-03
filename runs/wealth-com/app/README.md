# EstateCompass Demo MVP

Working title for `RUN-WEALTHCOM-001` Demo MVP per CC-001. **Not** "wealth.com" — registered marks not used.

This is the runnable application. Code lands here at Stage-6 Construction (currently scaffolding only). For the run's project book, see `runs/wealth-com/`.

## Architecture (per ADR-001 / ADR-002 / ADR-003)

```
apps/
  web/          React 18 + Vite + Tailwind — minimal advisor walkable UI
  api/          Node 20 + TS + Fastify — request-routing, RBAC, tenant_context, audit log
  ai-extract/   Python 3.12 + FastAPI — Sage extractor (Claude + grounding validator)
  calc-engine/  Python 3.12 + FastAPI — pure deterministic calc functions, golden-dataset tested
  observability/ OpenTelemetry collector config
packages/
  contracts/    JSON schemas + TS types — shared between web/api/ai-extract/calc-engine
  db/           connection-pool wrapper + tenant_context discipline + RLS-checking migrations
  tenant/       tenant_id types and binding helpers
```

The split is non-negotiable per ADR-001 (no LLM arithmetic) and ADR-002 (three-layer tenant isolation).

## Run locally

```bash
cp .env.example .env
# Fill ANTHROPIC_API_KEY in .env
docker compose up --build
# open http://localhost:5173
```

## Test

```bash
pnpm test           # all workspaces
pnpm test:unit      # unit only
pnpm test:integration
pnpm test:e2e       # Playwright (web)
pnpm validate:atoms # PRD atom provenance validator (lesson L-001)
```

## Quality gates (per dark-factory)

- Per-slice RALPH 5-loop record before merge
- ≥ 2 adversarial critics on every artifact
- Golden-dataset tests for every calc-engine rule
- Holdout dataset for ai-extract from public corpora (NOT PRD examples)
- Hawkeye independent audit at every stage exit

## Constraints (locked)

- Synthetic data only — no real PII/PHI (HD-008)
- Brand substitution: "EstateCompass" / "Sage" (not Ester / wealth.com)
- production_surface=false; this is local-Docker-only at v0
- LLMs do not perform tax/estate arithmetic (ADR-001)
- Multi-tenant via Postgres RLS + connection-pool wrapper + per-tenant KMS (ADR-002)
- AI extraction with citation grounding + confidence tiers + refusal honesty (ADR-003)
- UPL: facts only, no execution-ready legal documents (HD-007)
