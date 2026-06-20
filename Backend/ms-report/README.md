# ms-report

Microservice responsible for report management. It owns `report_db` and exposes report creation and query endpoints.

## Run Locally

```powershell
docker compose up --build report-db report-service
```

## Technical Table

| Item | Value |
|---|---|
| Language | Java 25 |
| Framework | Spring Boot 4 |
| Libraries | Spring Web MVC, Spring Data JPA, Flyway, PostgreSQL JDBC, Springdoc OpenAPI, JaCoCo |
| Database pattern | Database per Service |
| Database | PostgreSQL `report_db` |
| Design patterns | Layered architecture, Repository, DTO |

## Swagger and OpenAPI

With Docker Compose running, Swagger UI is available at:

```text
http://localhost:9083/swagger-ui/index.html
```

The OpenAPI JSON specification can be validated with:

```powershell
Invoke-WebRequest http://localhost:9083/v3/api-docs -UseBasicParsing
```

Quick endpoint checks:

```powershell
Invoke-RestMethod http://localhost:9083/api/reports
```

## Swagger Test Examples

Open `http://localhost:9083/swagger-ui/index.html`, press **Try it out**, fill the required values, and press **Execute**.

| Method | Endpoint | How to test |
|---|---|---|
| GET | `/api/reports/health` | Execute without parameters. Expected response: `200 OK`. |
| GET | `/api/reports` | Execute without parameters to list reports. |
| GET | `/api/reports/{id}` | Use an existing report id, for example `1` if seeded data exists. |
| POST | `/api/reports` | Use the create-report JSON below. Expected response: `201 Created`. |

Body for `POST /api/reports`:

```json
{
  "title": "Reporte Swagger",
  "description": "Reporte creado desde Swagger UI",
  "reportType": "OPERACIONAL",
  "status": "GENERADO"
}
```

`ms-report` does not currently expose `PUT` endpoints. Report updates would require implementing an update endpoint first.
