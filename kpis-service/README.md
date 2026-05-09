# kpis-service

Microservicio de KPIs (Spring Boot) con base de datos propia y migraciones.

## Base de datos

- Motor: PostgreSQL
- Contenedor: `kpis-db`
- Base: `kpis_db`
- Usuario: `kpis_user`
- Puerto host: `5434`

## Migraciones Flyway

Ubicación:

- `src/main/resources/db/migration`

Migraciones incluidas:

- `V1__create_kpis_schema.sql`
- `V2__seed_kpis_data.sql`

Tablas creadas:

- `kpi_summary`
- `monthly_sales`
- `branch_performance`
- `sales_channels`
- `alerts`

## Configuración

`application.properties` usa variables de entorno:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Con Docker Compose, estas variables ya están definidas.

## Ejecutar local (sin Docker)

1. Levanta PostgreSQL local (o Docker) en `localhost:5434` con `kpis_db`.
2. Ejecuta:

```bash
mvn spring-boot:run
```

## Endpoints

- `GET /api/kpis/summary`
- `GET /api/kpis/sales/monthly`
- `GET /api/kpis/branches/performance`
- `GET /api/kpis/channels`
- `GET /api/kpis/alerts`
