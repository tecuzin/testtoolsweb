# Slide 1 - Titre
**AgriTrack Demo - Plateforme de gestion parcellaire**  
- Frontend Angular 19 + Vite  
- Backend Express TypeScript + PostgreSQL  
- Qualite logicielle: unit, UI mocke, E2E, perf + reporting Streamlit  
- Date, nom, contexte de presentation

---

# Slide 2 - Objectif du projet
**Objectif metier**  
- Proposer une application simple de pilotage des parcelles pour une demo utilisateur

**Objectif technique**  
- Livrer une stack complete, dockerisee, testee, avec un reporting consolide

**Contrainte cle**  
- Rester coherent avec l'etat reel implemente (pas de sur-promesse E2E/perf hors scope)

---

# Slide 3 - Architecture globale
**Composants**
- `frontend` (Angular standalone, UI verte orientee demo)
- `backend` (API REST Express, validation metier)
- `db` (PostgreSQL, schema + seed)
- `e2e` (Cucumber + Playwright, stack reelle)
- `report` (Streamlit, rapport consolide)

**Flux**
- UI -> `/api` -> backend -> PostgreSQL  
- Tests -> artefacts couverture/resultats -> `reports/test-report.json` -> Streamlit

---

# Slide 4 - Parcours fonctionnels couverts
**Parcours demo**
- Liste des parcelles + creation d'une parcelle
- Detail parcelle + ajout plantation
- Detail parcelle + ajout traitement

**UX**
- Interface simplifiee pour public novice
- Navigation claire, actions visibles, lecture des statuts

---

# Slide 5 - Strategie de test (pyramide)
**Niveaux**
- Backend unit (Jest): logique metier service
- Front unit/UI mockes (Vitest): composants + service API mocke
- E2E (Cucumber/Playwright): flux complets sur stack docker
- Perf (k6): tenue API sous charge

**Principe**
- Separation stricte des niveaux pour fiabilite et vitesse

---

# Slide 6 - Correctifs majeurs realises
**Stabilisation CI/CD**
- Correction typage tests Angular pour passer `tsc --noEmit`
- Ajout des suites manquantes (frontend UI + backend treatment service)

**Stabilisation E2E Docker**
- Support TypeScript Cucumber en conteneur (`NODE_OPTIONS=--import=tsx`)
- Alignement image Playwright (v1.58.2)
- Proxy API frontend (`/api`) en dev (Vite) et prod (Nginx)

---

# Slide 7 - Resultats de qualite
**Execution globale**
- Lint + tests + build: OK
- E2E Docker profile: 2 scenarios / 11 steps passes
- Perf k6: seuils respectes (`p95 < 500ms`, erreur < 2%)

**Couverture (dernier run)**
- Backend statements: ~52.94%
- Frontend statements: ~78.72%
- Consolidee code: ~69.66%
- Composants Angular: ~91.49% (3/3 fichiers couverts)

---

# Slide 8 - Dashboard Streamlit
**Ce qu'on voit**
- KPIs couverture backend/frontend/consolidee
- Vue specifique composants Angular
- Graphiques E2E (passed/failed)
- Graphiques perf (thresholds/checks)

**Valeur**
- Lecture immediate de la qualite
- Support de decision avant livraison/demo

---

# Slide 9 - Demonstration live (plan 3 min)
1. Ouvrir AgriTrack (`localhost:4200`)
2. Creer une parcelle
3. Ouvrir le detail et ajouter plantation + traitement
4. Ouvrir Streamlit (`localhost:8501`) et montrer:
   - couverture consolidee
   - bloc composants Angular
   - E2E/perf au vert

---

# Slide 10 - Ecarts et transparence
**Etat reel vs cible**
- Front tests composants + service: atteints
- Backend services: couverture en progression, axe de renforcement encore possible
- E2E/perf: operationnels et dockerises
- Reporting: consolide et visualisable

---

# Slide 11 - Prochaines etapes
- Augmenter la couverture backend (cas d'erreur supplementaires, services restants)
- Ajouter tests front sur routes/edge cases
- Enrichir Streamlit avec historique multi-runs (tendance)
- Automatiser gates plus fins (seuils couverture/quality gates)

---

# Slide 12 - Conclusion
**Message cle**
- Plateforme complete, stable et demonstrable demain
- Pipeline repare, tests au vert, reporting clair
- Base solide pour continuer l'industrialisation
