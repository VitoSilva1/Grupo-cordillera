# Grupo Cordillera

Monorepo con arquitectura de microservicios para frontend, BFF, autenticación y KPIs.

## Servicios

- `front-web2`: frontend (Vite + React).
- `bff-service`: Backend for Frontend (Node/Express).
- `auth-service`: autenticación/usuarios (Spring Boot).
- `kpis-service`: indicadores de negocio (Spring Boot).

## Arquitectura de datos (actual)

Se implementó una **base de datos por microservicio**:

- `auth-service` -> `auth-db` (`auth_db`, PostgreSQL, host port `5433`)
- `kpis-service` -> `kpis-db` (`kpis_db`, PostgreSQL, host port `5434`)
- `bff-service` no tiene base de datos (solo orquesta APIs)

## Migraciones

Cada microservicio maneja sus propias migraciones con Flyway:

- `auth-service/src/main/resources/db/migration`
  - `V1__create_users_table.sql`
  - `V2__seed_default_users.sql`
- `kpis-service/src/main/resources/db/migration`
  - `V1__create_kpis_schema.sql`
  - `V2__seed_kpis_data.sql`

Flyway ejecuta scripts en orden y registra el historial en `flyway_schema_history` de cada base.

## Levantar todo con Docker

Desde la raíz del repo:

```bash
docker compose up --build
```

Si quieres dejarlo en segundo plano:

```bash
docker compose up -d --build
```

Ver estado:

```bash
docker compose ps
```

## Puertos

- Frontend: `http://localhost:5173`
- BFF: `http://localhost:8000`
- Auth API: `http://localhost:9080`
- KPIs API: `http://localhost:9081`
- Auth DB (host): `localhost:5433`
- KPIs DB (host): `localhost:5434`

## Endpoints principales

Auth:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/health`
- `GET /api/auth/users/me`

KPIs:

- `GET /api/kpis/summary`
- `GET /api/kpis/sales/monthly`
- `GET /api/kpis/branches/performance`
- `GET /api/kpis/channels`
- `GET /api/kpis/alerts`

## Notas

- `auth-service` usa JPA + Flyway + PostgreSQL.
- `kpis-service` usa JDBC + Flyway + PostgreSQL.
- El frontend activo del repositorio es `front-web2`.
