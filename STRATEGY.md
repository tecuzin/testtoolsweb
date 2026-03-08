# STRATEGY - Test Strategy

## Objectif

Garantir la qualite de l'application agricole avec une separation stricte des niveaux de tests:

1. **Backend unit tests (Jest)**: valider la logique metier isolee.
2. **Frontend unit/integration tests (Vitest)**: valider les composants Angular avec mocks API.
3. **E2E tests (Cucumber + Playwright)**: valider les parcours complets avec API et DB reelles.
4. **Performance tests (k6)**: valider la tenue des endpoints critiques sous charge.

## Pyramide de tests

- Base large: unit tests backend + frontend
- Milieu: integration frontend mockee
- Sommet: E2E plus peu nombreux mais representatifs
- Hors pyramide fonctionnelle: perf tests k6, executes regulierement

## Regles de separation

### Frontend (Vitest)

- Interdiction d'appel HTTP reel vers l'API.
- Le service `ApiService` est mocke dans les tests composants.
- Les tests doivent pouvoir tourner hors reseau et sans base.

### E2E (Playwright + Cucumber)

- Interdiction des mocks frontend/backend.
- Obligation d'utiliser la stack reelle `frontend + backend + postgres`.
- Reset des donnees avant scenario via endpoint `POST /api/test/reset` (active uniquement en environnement de test/demo).

## Donnees de test

- Jeu seed SQL pour 2 parcelles, 3 plantations, 2 traitements.
- Scenarios E2E ajoutent des donnees propres au test.
- Le reset rend les scenarios idempotents et rejouables.

## Couverture cible

- Backend unit: >= 70% statements sur la couche services.
- Frontend unit/integration: >= 60% statements sur composants critiques.
- E2E: couvrir 2 flux metiers critiques minimum:
  - creation parcelle
  - ajout plantation + traitement

## Quality gates proposes (CI)

1. `npm run test:unit:backend`
2. `npm run test:unit:frontend`
3. Build backend et frontend
4. E2E sur environnement ephemere docker-compose
5. k6 en nightly (ou pre-release)

Pipeline implemente:
- GitHub Actions: `.github/workflows/ci.yml`
- Gates executes a chaque push/PR:
  - `npm run lint`
  - `npm run demo:test:all-local`
  - `npm run build`
- Job E2E dockerise sur `push` vers `main`:
  - `docker compose --profile tests up --build --abort-on-container-exit --exit-code-from e2e e2e`
- Workflow nightly k6:
  - `.github/workflows/perf-nightly.yml`
  - execution via cron + declenchement manuel

En cas d'echec d'un gate, le pipeline est rouge.

## Bonnes pratiques

- Tests deterministes (pas de dependance a l'heure systeme non controlee)
- Donnees explicites dans chaque test
- Selecteurs E2E stables (`data-testid`)
- Timeout explicites et raisonnables
- Logs exploitables en cas d'echec

## Risques et mitigations

- **Flaky E2E**: mitiges par reset DB et selecteurs stables.
- **Couplage frontend/API**: mitige par mocks obligatoires en Vitest.
- **Regression perf API**: mitigee par k6 avec seuils p95 et taux d'erreur.
