---
name: rebuild-agri-demo-from-zero
description: Rebuilds the agri demo project from scratch by recreating the real implemented architecture, API contracts, frontend flows, and current test scope. Use when asked to regenerate this project, bootstrap a clean clone, or verify implementation parity against existing behavior.
---

# Rebuild Agri Demo From Zero

## Goal

Reproduce the current implemented state of this repository, not the full aspirational roadmap.

## Mandatory sources

Read these files first:
- `docs/IMPLEMENTATION_STATE.md`
- `docs/AI_REBUILD_PLAYBOOK.md`
- `README.md`
- `STRATEGY.md`

## Execution workflow

1. Recreate folder structure and root workspace scripts.
2. Rebuild backend (Express + TS + PostgreSQL) with the same route/service/repository layering.
3. Rebuild SQL schema and seed data exactly.
4. Rebuild frontend Angular standalone pages and API service contracts.
5. Restore existing backend unit tests.
6. Run parity checks and report gaps explicitly.

## Non-negotiable constraints

- Do not claim E2E, perf, or Docker are implemented unless files actually exist.
- Keep naming and payload contracts compatible with current frontend/backend integration.
- Keep environment-variable behavior unchanged (`PORT`, `DATABASE_URL`, `ENABLE_TEST_RESET`, `SEED_ON_STARTUP`).

## Output format

Always return:
1. Implemented/rebuilt items
2. Validation commands executed
3. Remaining gaps vs target plan

## Additional reference

For detailed contracts, use `reference-implementation.md`.

