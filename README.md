# Agri Testtools Demo

Mini-application de gestion de parcelles agricoles conçue pour demontrer une strategie de tests complete:

- **Frontend**: Angular (TypeScript)
- **Backend**: Express (TypeScript) + PostgreSQL
- **Tests unitaires backend**: Jest
- **Tests frontend mockes**: Vitest
- **Tests E2E BDD**: Cucumber + Playwright
- **Tests de performance API**: k6

## Fonctionnalites metier

- Gestion des parcelles (CRUD)
- Gestion des plantations liees aux parcelles
- Gestion des traitements appliques aux parcelles

## Architecture du repository

- `frontend/`: application Angular
- `backend/`: API Express + logique metier + SQL schema/seed
- `tests/e2e/`: features Gherkin + step definitions Playwright
- `tests/perf/`: scripts k6
- `infra/postgres/init/`: scripts SQL d'initialisation PostgreSQL
- `docs/`: documentation de demonstration et troubleshooting
- `docker-compose.yml`: orchestration locale portable
- `STRATEGY.md`: strategie de test multi-couches

## Prerequis

- Docker + Docker Compose
- Node.js 22+ (uniquement si execution hors Docker)
- k6 (uniquement si execution perf hors Docker)

## Demarrage rapide (Docker)

```bash
docker compose up --build
```

Application disponible sur:
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend health: [http://localhost:3000/health](http://localhost:3000/health)

Arret:

```bash
docker compose down
```

Arret + suppression des donnees PostgreSQL:

```bash
docker compose down -v
```

## Commandes one-liner (demo live)

```bash
# 1) Monter la stack complete en arriere-plan
npm run demo:stack:up

# 2) Lancer les tests unitaires backend + frontend
npm run demo:test:all-local

# 3) Lancer les E2E (stack reelle)
npm run test:e2e

# 4) Lancer la perf API
npm run test:perf

# 5) Arreter la stack
npm run demo:stack:down
```

## Execution des tests

### 1) Unit backend (Jest)

```bash
npm install
npm run test:unit:backend
```

### 2) Unit/integration frontend mockes (Vitest)

```bash
npm install
npm run test:unit:frontend
```

### 3) End-to-end BDD (Cucumber + Playwright)

Prerequis: stack backend + frontend + db active.

```bash
npm install
npm run test:e2e
```

Version Docker profile tests:

```bash
docker compose --profile tests up --build --abort-on-container-exit e2e
```

### 4) Performance API (k6)

Prerequis: backend actif.

```bash
npm run test:perf
```

## Variables d'environnement

Backend (`backend` service):
- `PORT` (defaut: `3000`)
- `DATABASE_URL` (defaut local postgres)
- `ENABLE_TEST_RESET` (`true` pour autoriser `POST /api/test/reset`)
- `SEED_ON_STARTUP` (`false` en compose)

E2E:
- `FRONT_URL` (defaut: `http://localhost:4200`)
- `API_URL` (defaut: `http://localhost:3000/api`)

## Criteres d'acceptation demo

- Les tests frontend Vitest passent sans backend lance (mocks obligatoires)
- Les tests E2E passent uniquement avec la stack reelle (frontend + backend + postgres)
- Le script k6 execute les scenarii nominal et spike sans depasser les seuils d'erreurs
- Le projet est deployable sur une autre machine via Docker Compose

## Ressources de doc

- Strategie de test: [STRATEGY.md](STRATEGY.md)
- Deroule de demonstration: [docs/DEMO.md](docs/DEMO.md)
- Depannage: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- CI pipeline: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Performance nightly: [.github/workflows/perf-nightly.yml](.github/workflows/perf-nightly.yml)
