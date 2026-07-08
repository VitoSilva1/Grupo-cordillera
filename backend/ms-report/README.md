# ms-report - Grupo Cordillera

Microservicio de reportes. Permite crear, listar y buscar reportes almacenados en su propia base PostgreSQL.

## Como funciona

```text
Frontend
  -> BFF /api/reports/*
    -> ms-report
      -> report_db PostgreSQL
```

`ms-report` es propietario de la informacion de reportes. El BFF consume este servicio para listar y crear reportes desde la vista `/reportes`.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | Java 25 |
| Framework | Spring Boot 4.0.6 |
| Librerias | Spring Web, Spring Data JPA, Flyway, PostgreSQL Driver, Springdoc OpenAPI 2.8.9, JUnit, JaCoCo 0.8.13 |
| Paquete base | `com.grupocordillera.report` |
| Patrones | Layered Architecture, Repository, DTO, Global Exception Handler |
| Base de datos | PostgreSQL `report_db` |
| Swagger | `http://localhost:9083/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9083/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9083/api/reports/health` | No expuesto por BFF/Gateway en el escenario actual |
| Swagger | `http://localhost:9083/swagger-ui/index.html` | No aplica |
| Listar reportes | `http://localhost:9083/api/reports` | `http://localhost:8000/api/reports` |
| Crear reportes | `http://localhost:9083/api/reports` | `http://localhost:8000/api/reports` |
| Buscar reporte por ID | `http://localhost:9083/api/reports/{id}` | No expuesto por BFF/Gateway en el escenario actual |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5436/report_db` |
| `SPRING_DATASOURCE_USERNAME` | `report_user` |
| `SPRING_DATASOURCE_PASSWORD` | `report_pass` |

## Como ejecutar

Desde la raiz:

```bash
docker compose up --build report-db report-service
```

Local directo:

```bash
cd backend/ms-report
mvn spring-boot:run
```

## Swagger

Abrir:

```text
http://localhost:9083/swagger-ui/index.html
```

### Pruebas en Swagger

| Endpoint | Metodo | Como probar | Resultado esperado |
|---|---|---|---|
| `/api/reports/health` | `GET` | Click en `Try it out` y `Execute` | `{"status":"UP","service":"report-service"}` |
| `/api/reports` | `GET` | Ejecutar sin body | Lista de reportes persistidos |
| `/api/reports` | `POST` | Body con `title`, `description`, `reportType`, `status` | Reporte creado con status `201` |
| `/api/reports/{id}` | `GET` | Parametro `id`, por ejemplo `1` | Reporte encontrado o `404` |

En el escenario actual del frontend, `GET /api/reports` y `POST /api/reports` se exponen por KrakenD y se usan en la vista `/reportes`. `GET /api/reports/{id}` queda disponible para pruebas directas del microservicio, pero no como contrato publico del frontend.

## Endpoints y ejemplos

### Health check

```bash
curl http://localhost:9083/api/reports/health
```

### Crear reporte

```bash
curl -X POST http://localhost:9083/api/reports \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Reporte mensual\",\"description\":\"Resumen de ventas del mes\",\"reportType\":\"SALES\",\"status\":\"PENDING\"}"
```

### Listar reportes

```bash
curl http://localhost:9083/api/reports
```

### Buscar reporte por ID

```bash
curl http://localhost:9083/api/reports/1
```

### Probar via BFF

```bash
curl http://localhost:8000/api/reports
```

## Tests y cobertura

```bash
cd backend/ms-report
mvn verify
```

JaCoCo valida minimo 60% de cobertura de lineas.
