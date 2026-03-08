# Etat d'implementation detaille

Ce document decrit uniquement ce qui est effectivement implemente et valide dans le depot.

## 1. Monorepo et outillage

- npm workspaces declares en racine:
  - `frontend`
  - `backend`
  - `tests/e2e`
- Configuration TypeScript partagee: `tsconfig.base.json`
- Script perf racine execute k6 via Docker (pas besoin de binaire k6 local):
  - `npm run test:perf`
- A la date de validation, le dossier est utilise hors git local.

## 2. Backend (Express + TypeScript + PostgreSQL)

## 2.1 Bootstrap et configuration

- Entree: `backend/src/index.ts`
- Serveur Express: `backend/src/app.ts`
- Config env: `backend/src/config/env.ts`
- Connexion DB: `backend/src/db/pool.ts`
- Initialisation schema au demarrage: `ensureDatabaseReady()`
- Seed optionnel au demarrage si `SEED_ON_STARTUP=true`
- Endpoint test reset: `POST /api/test/reset` (si `ENABLE_TEST_RESET=true`)

## 2.2 Schema SQL

Fichiers:
- `backend/src/db/schema.sql`
- `backend/src/db/seed.sql`

Tables:
- `parcels`
- `plantings` (FK `parcel_id`)
- `treatments` (FK `parcel_id`, FK optionnelle `planting_id`)

Caracteristiques:
- contraintes surface `> 0`
- index sur colonnes de jointure
- reset+seed idempotent via `TRUNCATE ... RESTART IDENTITY`

## 2.3 Architecture applicative

Organisation en 3 couches:
1. Routes (`backend/src/routes`)
2. Services metier (`backend/src/services`)
3. Repositories SQL (`backend/src/repositories`)

Regles metier notables:
- validation des payloads via Zod dans les services
- erreurs metier via `DomainError` avec code HTTP
- verification d'existence parcelle avant creation de plantation/traitement

## 2.4 Endpoints exposes

- `GET /health`
- `GET /api/parcels`
- `GET /api/parcels/:id`
- `POST /api/parcels`
- `PUT /api/parcels/:id`
- `DELETE /api/parcels/:id`
- `GET /api/plantings/parcel/:parcelId`
- `POST /api/plantings`
- `DELETE /api/plantings/:id`
- `GET /api/treatments/parcel/:parcelId`
- `POST /api/treatments`
- `DELETE /api/treatments/:id`
- `POST /api/test/reset`

## 2.5 Tests backend

- Outil: Jest + ts-jest
- Fichiers:
  - `backend/tests/parcel.service.spec.ts`
  - `backend/tests/planting.service.spec.ts`
  - `backend/tests/treatment.service.spec.ts`
- Couche couverte: services metier (tests unitaires)
- Pas de tests HTTP d'integration a ce stade

## 3. Frontend (Angular 19 standalone + Vite)

## 3.1 Setup

- Entree: `frontend/src/main.ts`
- Root component: `frontend/src/app/app.component.ts`
- Routing: `frontend/src/app/app.routes.ts`
- Styles globaux: `frontend/src/styles.css`

## 3.2 Composants metier

- `ParcelListComponent`
  - liste des parcelles
  - formulaire creation parcelle
  - navigation vers detail parcelle
- `ParcelDetailComponent`
  - affichage details parcelle
  - creation plantation
  - creation traitement

## 3.3 Couche API front

- Service: `frontend/src/app/api.service.ts`
- Base URL:
  - `import.meta.env.VITE_API_URL`
  - fallback `http://localhost:3000/api`
- Modeles TypeScript:
  - `Parcel`, `Planting`, `Treatment`, `ParcelDetails`

## 3.4 Tests frontend

- Outil: Vitest (jsdom)
- Fichier:
  - `frontend/src/app/app.component.spec.ts`
  - `frontend/src/app/api.service.spec.ts`
  - `frontend/src/app/parcel-list.component.spec.ts`
  - `frontend/src/app/parcel-detail.component.spec.ts`
- Nature des tests:
  - appels HTTP mockes (pas d'appel API reel)
  - tests UI de composants standalone avec `ApiService` mocke

## 4. E2E et performance

## 4.1 E2E (Cucumber + Playwright)

- Dossier present: `tests/e2e`
- Feature metier: `tests/e2e/features/parcels.feature`
- Steps: `tests/e2e/steps/parcels.steps.ts`
- World Playwright: `tests/e2e/support/world.ts`
- Browser Chromium Playwright requis sur machine locale (`npx playwright install chromium`)
- Validation realisee: 2 scenarios / 11 steps passes sur stack reelle dockerisee

## 4.2 Performance (k6)

- Script present: `tests/perf/api-load.js`
- Scenarios:
  - `normal_load` (constant-vus)
  - `spike_load` (ramping-vus)
- Seuils:
  - `http_req_failed < 2%`
  - `http_req_duration p95 < 500ms`
- Validation realisee via conteneur `grafana/k6` avec seuils respectes

## 5. Dockerisation

Fichiers:
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `tests/e2e/Dockerfile`
- `.dockerignore`

Statut:
- `docker compose up --build -d` valide (db + backend + frontend up, backend healthy)
- front accessible sur `http://localhost:4200`
- backend health OK sur `http://localhost:3000/health`

## 6. Ecarts cible planifiee vs etat reel

Par rapport au plan initial:
- Cible front tests: composants + services mockes
- Etat reel valide: tests de service API mocke + specs composants UI mockees (liste/detail)
- Cible gates CI completes: non configurees ici (execution locale manuelle validee)
- Cible perf locale via k6 natif: remplacee par execution Docker pour portabilite

## 7. Contrat de reconstruction

Pour reconstruire un clone fonctionnel equivalent:
1. conserver l'architecture monorepo et scripts npm
2. conserver schema+seed SQL
3. conserver endpoints REST et regles de services
4. conserver stack Docker et healthchecks
5. conserver separation des niveaux de test (frontend mocke, E2E reel, perf k6)
