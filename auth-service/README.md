# auth-service

Microservicio de autenticación (Spring Boot) con base de datos propia y migraciones.

## Base de datos

- Motor: PostgreSQL
- Contenedor: `auth-db`
- Base: `auth_db`
- Usuario: `auth_user`
- Puerto host: `5433`

## Migraciones Flyway

Ubicación:

- `src/main/resources/db/migration`

Migraciones incluidas:

- `V1__create_users_table.sql`
- `V2__seed_default_users.sql`

## Configuración

`application.properties` usa variables de entorno:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Con Docker Compose, estas variables ya están definidas.

## Ejecutar local (sin Docker)

1. Levanta PostgreSQL local (o Docker) en `localhost:5433` con `auth_db`.
2. Ejecuta:

```bash
mvn spring-boot:run
```

## Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/health`
- `GET /api/auth/users/me`
