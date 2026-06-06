# report-service

Microservicio Spring Boot para generar reportes a partir de datos de `kpis-service`.

## Endpoints

- `GET /api/reports/health`
- `POST /api/reports`
- `GET /api/reports/{id}`
- `GET /api/reports/{id}/download`

## Request de creación

```json
{
  "type": "KPI_SUMMARY",
  "dateFrom": "2026-01-01",
  "dateTo": "2026-01-31",
  "format": "CSV"
}
```

## Variables de entorno

- `SPRING_DATASOURCE_URL` (default: `jdbc:postgresql://localhost:5435/reports_db`)
- `SPRING_DATASOURCE_USERNAME` (default: `reports_user`)
- `SPRING_DATASOURCE_PASSWORD` (default: `reports_pass`)
- `KPIS_API_BASE_URL` (default: `http://localhost:8081/api/kpis`)
