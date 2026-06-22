# ms-report - Grupo Cordillera

Microservicio de reportes. Permite crear, listar y buscar reportes almacenados en su propia base PostgreSQL.

## Como funciona

```text
Frontend
  -> BFF /api/reports/*
    -> ms-report
      -> report_db PostgreSQL
```

`ms-report` es propietario de la informacion de reportes. El BFF puede consumir este servicio para armar el dashboard agregado.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | Java 25 |
| Framework | Spring Boot 4 |
| Librerias | Spring Web, Spring Data JPA, Flyway, PostgreSQL Driver, Springdoc OpenAPI, JUnit, JaCoCo |
| Paquete base | `com.grupocordillera.report` |
| Patrones | Layered Architecture, Repository, DTO, Global Exception Handler |
| Base de datos | PostgreSQL `report_db` |
| Swagger | `http://localhost:9083/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9083/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9083/api/reports/health` | `http://localhost:8000/api/reports/health` |
| Swagger | `http://localhost:9083/swagger-ui/index.html` | No aplica |
| Reports | `http://localhost:9083/api/reports` | `http://localhost:8000/api/reports` |

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

## Endpoints y ejemplos

### Health check

```bash
curl http://localhost:9083/api/reports/health
```

### Crear reporte

```bash
curl -X POST http://localhost:9083/api/reports \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Reporte mensual\",\"description\":\"Resumen de ventas del mes\",\"reportType\":\"SALES\",\"status\":\"CREATED\"}"
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
