# Rebuild Project From Zero

Objectif: reconstruire ce projet depuis zero en reproduisant l'etat implemente reel.

Instructions:
1. Lire `docs/IMPLEMENTATION_STATE.md`, `docs/AI_REBUILD_PLAYBOOK.md`, `README.md`, `STRATEGY.md`.
2. Recreer d'abord l'ossature monorepo + scripts npm.
3. Rebuild backend, puis frontend, puis tests backend existants.
4. Verifier la parite fonctionnelle avec des commandes de build/test/lint.
5. Produire un rapport final:
   - ce qui a ete reproduit
   - ce qui est valide
   - les ecarts restants (E2E, perf, Docker, etc.)

Contexte complementaire utilisateur:
`$ARGUMENTS`

