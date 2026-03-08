# Plan de demonstration (10-15 min)

## Objectif de la demo

Montrer la complementarite des outils de tests sur une application web Angular + backend TypeScript.

## Sequence recommandee

1. **Presentation rapide (1 min)**
   - Domaine: parcelles, plantations, traitements
   - Separation des niveaux de test

2. **Unit backend avec Jest (2-3 min)**
   - Lancer: `npm run test:unit:backend`
   - Montrer un test de regle metier (parcelle inexistante)
   - Message cle: logique metier validee sans DB

3. **Frontend mocke avec Vitest (2-3 min)**
   - Lancer: `npm run test:unit:frontend`
   - Montrer que les composants tournent avec `ApiService` mocke
   - Message cle: zero dependance API/backend

4. **E2E BDD reelle avec Cucumber + Playwright (3-4 min)**
   - Lancer stack: `docker compose up --build -d`
   - Installer Chromium (si besoin local): `npx playwright install chromium`
   - Lancer E2E: `npm run test:e2e`
   - Montrer feature Gherkin + resultat execution
   - Message cle: verification bout-en-bout sur stack reelle

5. **Performance API avec k6 (2 min)**
   - Lancer: `npm run test:perf`
   - Lire p95, erreurs et throughput
   - Message cle: controle de la tenue en charge (k6 execute en conteneur Docker)

## Messages clefs a faire passer

- On ne remplace pas un type de test par un autre: ils se completent.
- Les tests frontend mockes securisent vite la UI.
- Les E2E valident l'integration reelle et les parcours metiers.
- Les tests de charge permettent d'anticiper les regressions non fonctionnelles.

## Checklist demo

- Docker est demarre
- Ports 3000, 4200, 5432 libres
- `ENABLE_TEST_RESET=true` pour le backend
- Au moins un scenario E2E passe en live
- Rapport k6 lisible (latence et erreur)
