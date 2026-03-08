# Etat d'implementation detaille

Ce document decrit uniquement ce qui est effectivement implemente dans le depot.

## 1. Monorepo et outillage

- npm workspaces declares en racine:
  - `frontend`
  - `backend`
  - `tests/e2e` (absent actuellement)
- TypeScript base shared: `tsconfig.base.json`
- Aucun depot git initialise localement au moment de la documentation.

## 2. Backend (Express + TypeScript + PostgreSQL)

## 2.1 Bootstrap et configuration

- Entree: `backend/src/index.ts`
- Serveur Express: `backend/src/app.ts`
- Config env: `backend/src/config/env.ts`
- Connexion DB: `backend/src/db/pool.ts`
- Initialisation schema au demarrage: `ensureDatabaseReady()`
- Seed optionnel au demarrage si `SEED_ON_STARTUP=true`

## 2.2 Schema SQL

Fichiers:
- `backend/src/db/schema.sql`
- `backend/src/db/seed.sql`

Tables:
- `parcels`
- `plantings` (FK `parcel_id`)
- `treatments` (FK `parcel_id`, FK optionnelle `planting_id`)

Caracteristiques:
- contraintes de surface `> 0`
- indexes sur colonnes de jointure
- seed demo idempotent via `TRUNCATE ... RESTART IDENTITY`

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
- `POST /api/test/reset` (actif uniquement si `ENABLE_TEST_RESET=true`)

## 2.5 Gestion d'erreurs

Middleware central dans `backend/src/app.ts`:
- `DomainError` -> status embarque
- `ZodError` -> `400 Payload invalide`
- fallback -> `500 Erreur interne`

## 2.6 Tests backend

- Outil: Jest + ts-jest
- Fichiers:
  - `backend/tests/parcel.service.spec.ts`
  - `backend/tests/planting.service.spec.ts`
- Pas de test repository ni integration HTTP actuellement.

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
- Modeles TypeScript partages au front:
  - `Parcel`, `Planting`, `Treatment`, `ParcelDetails`

## 3.4 Tests frontend

- Vitest est configure (`vite.config.ts`)
- setup jsdom present (`src/test-setup.ts`)
- aucun spec `*.spec.ts` present actuellement

## 4. Gaps par rapport au plan initial

Non implementes a date:
- dossier `tests/e2e` (Playwright/Cucumber)
- dossier `tests/perf` et scripts k6
- Dockerfiles + `docker-compose.yml`
- docs de demo/troubleshooting initialement prevus

## 5. Contrat de reconstruction

Pour reconstruire un clone fonctionnel du depot actuel, respecter:
1. meme architecture de dossiers
2. memes scripts npm en racine et par workspace
3. meme schema SQL et seed
4. memes endpoints REST
5. meme comportement front (listes + formulaires)
6. meme couverture de tests existants (au minimum les 2 specs backend)

