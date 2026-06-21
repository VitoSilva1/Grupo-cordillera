# ms-kpis - Grupo Cordillera

Microservicio de indicadores del dashboard. Entrega resumen de KPIs, ventas mensuales, desempeno por sucursal, canales de venta y alertas operacionales.

## Como funciona

```text
Frontend
  -> BFF /api/kpis/*
    -> ms-kpis
      -> kpis_db PostgreSQL
```

`ms-kpis` usa el patron Strategy para resolver cada tipo de indicador sin llenar el controlador de condicionales.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | Java 25 |
| Framework | Spring Boot 4 |
| Librerias | Spring Web, Spring JDBC, Flyway, PostgreSQL Driver, Springdoc OpenAPI, JUnit, JaCoCo |
| Paquete base | `com.grupocordillera.kpis` |
| Patrones | Layered Architecture, Strategy, Factory, Repository, DTO, Global Exception Handler |
| Base de datos | PostgreSQL `kpis_db` |
| Swagger | `http://localhost:9081/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9081/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9081/api/kpis/health` | `http://localhost:8000/api/kpis/health` |
| Swagger | `http://localhost:9081/swagger-ui/index.html` | No aplica |
| Summary | `http://localhost:9081/api/kpis/summary` | `http://localhost:8000/api/kpis/summary` |
| Dashboard agregado | No aplica | `http://localhost:8000/api/dashboard` |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5434/kpis_db` |
| `SPRING_DATASOURCE_USERNAME` | `kpis_user` |
| `SPRING_DATASOURCE_PASSWORD` | `kpis_pass` |

## Como ejecutar

Desde la raiz:

```bash
docker compose up --build kpis-db kpis-service
```

Local directo:

```bash
cd backend/ms-kpis
mvn spring-boot:run
```

## Swagger

Abrir:

```text
http://localhost:9081/swagger-ui/index.html
```

## Endpoints y ejemplos

### Health check

```bash
curl http://localhost:9081/api/kpis/health
```

### Resumen general

```bash
curl http://localhost:9081/api/kpis/summary
```

### Ventas mensuales

```bash
curl http://localhost:9081/api/kpis/sales/monthly
```

### Desempeno por sucursal

```bash
curl http://localhost:9081/api/kpis/branches/performance
```

### Canales de venta

```bash
curl http://localhost:9081/api/kpis/channels
```

### Alertas

```bash
curl http://localhost:9081/api/kpis/alerts
```

### Consulta por tipo de KPI

Valores validos:

- `SUMMARY`
- `MONTHLY_SALES`
- `BRANCH_PERFORMANCE`
- `SALES_CHANNELS`
- `ALERTS`

Ejemplo:

```bash
curl http://localhost:9081/api/kpis/SUMMARY
```

### Dashboard agregado desde el BFF

```bash
curl http://localhost:8000/api/dashboard
```

## Tests y cobertura

```bash
cd backend/ms-kpis
mvn verify
```

JaCoCo valida minimo 60% de cobertura de lineas.
