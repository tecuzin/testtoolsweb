# Playbook IA - Refaire le projet depuis zero

Ce playbook est ecrit pour un agent IA qui doit regenerer le projet sans historique.

## Etape 0 - Cible a atteindre

Reproduire exactement l'etat implemente actuel:
- backend Express/TypeScript/PostgreSQL operationnel
- frontend Angular standalone operationnel
- tests unitaires backend existants
- sans E2E/perf/docker (ces volets restent a ajouter ensuite)

## Etape 1 - Initialiser l'arborescence

Creer:
- `backend/`
- `frontend/`
- `docs/`
- `.cursor/rules/`
- `.cursor/skills/`
- `.cursor/commands/`

Configurer un `package.json` racine avec workspaces:
- `frontend`
- `backend`
- `tests/e2e` (meme si non implemente)

## Etape 2 - Refaire le backend

### Dependances
- runtime: `express`, `cors`, `dotenv`, `pg`, `zod`
- dev: `typescript`, `tsx`, `jest`, `ts-jest`, `@types/*`

### Fichiers obligatoires
- `src/index.ts`
- `src/app.ts`
- `src/config/env.ts`
- `src/db/pool.ts`
- `src/db/bootstrap.ts`
- `src/db/schema.sql`
- `src/db/seed.sql`
- `src/types/domain.ts`
- `src/repositories/*.ts`
- `src/services/*.ts`
- `src/routes/*.ts`
- `tests/parcel.service.spec.ts`
- `tests/planting.service.spec.ts`

### Contrats a conserver
- validations Zod dans services
- architecture routes -> services -> repositories
- endpoint test reset conditionnel sur variable env
- mapping snake_case SQL vers camelCase TypeScript

## Etape 3 - Refaire le frontend

### Dependances
- Angular 19 (`@angular/*`)
- `@analogjs/vite-plugin-angular`
- `vite`, `vitest`, `jsdom`, `typescript`

### Fichiers obligatoires
- `src/main.ts`
- `src/app/app.component.ts`
- `src/app/app.routes.ts`
- `src/app/models.ts`
- `src/app/api.service.ts`
- `src/app/parcel-list.component.ts`
- `src/app/parcel-detail.component.ts`
- `src/styles.css`
- `src/test-setup.ts`

### Parcours UI minimum
- page liste parcelles + formulaire ajout
- page detail parcelle + formulaires plantation/traitement
- retour vers liste

## Etape 4 - Verifier la parite fonctionnelle

Checklist:
- `npm run dev:backend` demarre sans erreur
- `npm run dev:frontend` demarre sans erreur
- `GET /health` repond `{ ok: true }`
- creation parcelle depuis UI fonctionne
- detail parcelle affiche plantations + traitements
- `npm run test:unit:backend` passe

## Etape 5 - Dresser les ecarts restants

L'agent doit signaler explicitement:
- absence `tests/e2e`
- absence `tests/perf`
- absence Docker
- absence pipeline CI/CD

Ne pas simuler ces parties; les lister comme backlog de completion.

