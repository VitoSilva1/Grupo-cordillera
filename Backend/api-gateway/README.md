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
| Tecnologia | KrakenD |
| Rol | API Gateway |
| Puerto local | `8088` |
| Puerto interno | `8088` |
| Backend principal | `bff-service:8000` |
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

## Configuracion clave

El archivo [krakend.json](./krakend.json) define:

- Puerto de escucha `8088`.
- CORS para llamadas desde el frontend.
- Propagacion de headers `Content-Type` y `Authorization`.
- Propagacion de query strings.
- Endpoints publicos `/api/auth/*`, `/api/users/*`, `/api/kpis/*`, `/api/reports/*` y `/api/dashboard`.
- Backend comun `http://bff-service:8000`.

KrakenD no queda configurado como proxy wildcard abierto; las rutas publicas se declaran explicitamente para que el contrato del gateway sea claro.
