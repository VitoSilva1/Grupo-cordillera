# api-gateway - Grupo Cordillera

API Gateway HTTP del proyecto. Esta hecho con Nginx y es la puerta de entrada para todas las rutas `/api/*`.

## Que hace

El gateway recibe las peticiones del frontend y las reenvia al BFF.

```text
Frontend
  -> api-gateway :8088
    -> bff-service :8000
      -> ms-auth / ms-user / ms-kpis / ms-report
```

No contiene logica de negocio. Su trabajo es enrutar, conservar headers importantes y responder health checks.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Tecnologia | Nginx |
| Rol | API Gateway / Reverse Proxy |
| Puerto local | `8088` |
| Puerto interno | `8088` |
| Upstream | `bff-service:8000` |
| Patrones | API Gateway, Reverse Proxy |
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

Respuesta esperada:

```json
{
  "status": "UP",
  "service": "api-gateway"
}
```

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

El archivo [nginx.conf](./nginx.conf) define:

- `location = /health`: health check del gateway.
- `location /api/`: proxy hacia el BFF.
- Headers `X-Real-IP`, `X-Forwarded-For` y `X-Forwarded-Proto`.
- Headers CORS para permitir llamadas desde el frontend.
