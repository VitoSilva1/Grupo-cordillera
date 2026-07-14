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
| Framework | Spring Boot 4.0.6 |
| Librerias | Spring Web, Spring JDBC, Flyway, PostgreSQL Driver, Springdoc OpenAPI 2.8.9, JUnit, JaCoCo 0.8.13 |
| Paquete base | `com.grupocordillera.kpis` |
| Patrones | Layered Architecture, Strategy, Factory, Repository, DTO, Global Exception Handler |
| Base de datos | PostgreSQL `kpis_db` |
| Swagger | `http://localhost:9081/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9081/v3/api-docs` |
| Observabilidad | Logs Spring Boot por Docker/Kubernetes; sin SDK Sentry activo |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9081/api/kpis/health` | No expuesto por BFF/Gateway en el escenario actual |
| Swagger | `http://localhost:9081/swagger-ui/index.html` | No aplica |
| Summary | `http://localhost:9081/api/kpis/summary` | `http://localhost:8000/api/kpis/summary` |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5434/kpis_db` |
| `SPRING_DATASOURCE_USERNAME` | `kpis_user` |
| `SPRING_DATASOURCE_PASSWORD` | `kpis_pass` |
| `GLITCHTIP_DSN` | Disponible en Kubernetes, pero sin starter Sentry activo en el `pom.xml` |

`GLITCHTIP_DSN` queda definido en el `ConfigMap` para mantener la configuracion preparada, pero este microservicio no envia eventos a GlitchTip directamente. El starter Sentry fue retirado por incompatibilidad con Spring Boot 4.0.6.

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

### Pruebas en Swagger

| Endpoint | Metodo | Como probar | Resultado esperado |
|---|---|---|---|
| `/api/kpis/health` | `GET` | Click en `Try it out` y `Execute` | `{"status":"UP","service":"kpis-service"}` |
| `/api/kpis/summary` | `GET` | Ejecutar sin body | Resumen con ventas, margen, stock, reclamos, ticket y satisfaccion |
| `/api/kpis/sales/monthly` | `GET` | Ejecutar sin body | Lista de ventas mensuales |
| `/api/kpis/branches/performance` | `GET` | Ejecutar sin body | Lista de desempeno por sucursal |
| `/api/kpis/channels` | `GET` | Ejecutar sin body | Distribucion de ventas por canal |
| `/api/kpis/alerts` | `GET` | Ejecutar sin body | Lista de alertas |
| `/api/kpis/{type}` | `GET` | Parametro `type`: `SUMMARY`, `MONTHLY_SALES`, `BRANCH_PERFORMANCE`, `SALES_CHANNELS` o `ALERTS` | Respuesta segun estrategia KPI |

En el escenario actual del frontend, se exponen por KrakenD los endpoints especificos: `/summary`, `/sales/monthly`, `/branches/performance`, `/channels` y `/alerts`. El endpoint generico `/{type}` queda disponible solo directo en el microservicio.

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

## Tests y cobertura

```bash
cd backend/ms-kpis
mvn verify
```

JaCoCo valida minimo 60% de cobertura de lineas.

## Logs

Docker Compose:

```bash
docker compose logs -f kpis-service
```

Kubernetes:

```powershell
kubectl logs -n grupo-cordillera deployment/kpis-service -f
```
