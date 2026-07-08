# api-gateway - Grupo Cordillera

API Gateway HTTP del proyecto. Esta hecho con KrakenD y es la puerta de entrada para las rutas `/api/*`.

## Que hace

El gateway recibe las peticiones del frontend y las reenvia al BFF.

```text
Frontend
  -> api-gateway :8088
    -> bff-service :8000
      -> ms-auth / ms-user / ms-kpis / ms-report
```

No contiene logica de negocio. Su trabajo es exponer endpoints publicos, aplicar configuracion transversal de CORS y delegar las solicitudes al BFF.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Tecnologia | KrakenD 2.13 |
| Rol | API Gateway |
| Puerto local | `8088` |
| Puerto interno | `8088` |
| Backend principal | `bff-service:8000` |
| Imagen base | `krakend:2.13` |
| Configuracion | `krakend.json` |
| Patrones | API Gateway, Reverse Proxy, Fachada |
| Swagger | No aplica. Swagger esta en cada microservicio Java |

## URLs importantes

| Recurso | URL |
|---|---|
| Health check | `http://localhost:8088/health` |
| API via gateway | `http://localhost:8088/api/...` |

## Como ejecutar

Desde la raiz del repositorio:

```bash
docker compose up --build api-gateway
```

Normalmente se levanta junto al stack completo:

```bash
docker compose up --build
```

## Endpoints y ejemplos

El gateway publica solo los endpoints usados por el frontend actual:

| Metodo | Endpoint | Uso |
|---|---|---|
| `GET` | `/health` | Health check del gateway/BFF |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/users` | Crear usuario |
| `GET` | `/api/kpis/summary` | Tarjetas KPI |
| `GET` | `/api/kpis/sales/monthly` | Grafico de ventas mensuales |
| `GET` | `/api/kpis/branches/performance` | Grafico de sucursales |
| `GET` | `/api/kpis/channels` | Grafico de canales |
| `GET` | `/api/kpis/alerts` | Vista y tabla de alertas |
| `GET` | `/api/reports` | Vista de reportes |
| `POST` | `/api/reports` | Crear reportes desde la vista de reportes |

### Health check

```bash
curl http://localhost:8088/health
```

El endpoint `/health` del gateway esta declarado en KrakenD y delega al health check del BFF.

### Probar login a traves del gateway

```bash
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"vendedor\",\"password\":\"1234\"}"
```

### Probar KPIs a traves del gateway

```bash
curl http://localhost:8088/api/kpis/summary
```

### Probar reportes a traves del gateway

```bash
curl http://localhost:8088/api/reports
```

### Crear reporte a traves del gateway

```bash
curl -X POST http://localhost:8088/api/reports \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Reporte mensual\",\"description\":\"Resumen de ventas\",\"reportType\":\"SALES\",\"status\":\"PENDING\"}"
```

## Configuracion clave

El archivo [krakend.json](./krakend.json) define:

- Puerto de escucha `8088`.
- CORS para llamadas desde el frontend.
- Propagacion de headers `Content-Type` y `Authorization`.
- Propagacion de query strings.
- Endpoints publicos estrictamente usados por el frontend.
- Backend comun `http://bff-service:8000`.

KrakenD no queda configurado como proxy wildcard abierto; las rutas publicas se declaran explicitamente para que el contrato del gateway sea claro. Endpoints como `/api/dashboard`, `/api/auth/register`, `/api/auth/public-key`, `/api/users/authenticate`, `/api/kpis/{type}` y `/api/reports/{id}` no se exponen por el gateway en el escenario actual.
