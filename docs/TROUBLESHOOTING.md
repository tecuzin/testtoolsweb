# Troubleshooting

## Docker

### Le frontend n'est pas accessible

- Verifier le service: `docker compose ps`
- Verifier logs frontend: `docker compose logs frontend`
- Verifier le port local 4200

### Le backend ne demarre pas

- Verifier logs backend: `docker compose logs backend`
- Verifier la DB: `docker compose logs db`
- Verifier `DATABASE_URL` dans compose

### Reinitialiser completement l'environnement

```bash
docker compose down -v
docker compose up --build
```

## Tests frontend (Vitest)

### Erreur liee a Angular compiler

- Verifier `frontend/src/test-setup.ts` et la presence de `@angular/compiler`.

### Test qui appelle l'API reelle

- Remplacer les providers par un mock `ApiService` dans le test.
- Verifier qu'aucun endpoint HTTP reel n'est cible.

## Tests E2E

### E2E echoue sur reset DB

- Verifier que backend expose `POST /api/test/reset`.
- Verifier `ENABLE_TEST_RESET=true`.
- Verifier URL `API_URL` dans les variables e2e.

### E2E flaky

- Utiliser `data-testid` uniquement.
- Ajouter attente explicite d'element visible.
- S'assurer que la base est reset avant chaque scenario.

## k6

### Seuil p95 depasse

- Verifier charge machine locale.
- Verifier que la base n'est pas saturee.
- Rejouer avec moins de VUs pour calibrer la baseline.
