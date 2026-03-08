# Reference Implementation Contracts

## Backend API

Base prefix: `/api`

- `GET /parcels`
- `GET /parcels/:id`
- `POST /parcels`
- `PUT /parcels/:id`
- `DELETE /parcels/:id`
- `GET /plantings/parcel/:parcelId`
- `POST /plantings`
- `DELETE /plantings/:id`
- `GET /treatments/parcel/:parcelId`
- `POST /treatments`
- `DELETE /treatments/:id`
- `POST /test/reset` (only when `ENABLE_TEST_RESET=true`)

Health endpoint:
- `GET /health` -> `{ "ok": true }`

## Domain models

- `Parcel`: id, name, areaHectares, location, createdAt
- `Planting`: id, parcelId, cropType, plantedAt, areaHectares, createdAt
- `Treatment`: id, parcelId, plantingId|null, treatmentType, appliedAt, dose, notes|null, createdAt
- `ParcelDetails`: parcel + plantings[] + treatments[]

## SQL data model

Tables:
- `parcels`
- `plantings` with FK to parcels (cascade delete)
- `treatments` with FK to parcels and optional FK to plantings (set null on delete)

Operational rules:
- area must be positive
- indexes on foreign keys
- seed performs truncate + identity restart

## Frontend routes and behavior

Routes:
- `/` -> parcel list + create parcel form
- `/parcels/:id` -> parcel details + create planting/treatment forms

Frontend data source:
- all HTTP calls centralized in `ApiService`
- API base URL from `VITE_API_URL` with default `http://localhost:3000/api`

## Testing scope currently expected

- Present:
  - `backend/tests/parcel.service.spec.ts`
  - `backend/tests/planting.service.spec.ts`
- Configured but empty:
  - frontend Vitest suite (`frontend/src/**/*.spec.ts` expected, none present)

## Explicit non-implemented parts

- `tests/e2e`
- `tests/perf`
- Dockerfiles and `docker-compose.yml`
- CI pipelines

