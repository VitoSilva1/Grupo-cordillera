# bff - Grupo Cordillera

Backend For Frontend construido con NestJS y TypeScript. Es la capa que habla con el frontend y oculta la complejidad de los microservicios.

## Que hace

El BFF recibe llamadas del frontend, consulta los microservicios necesarios y devuelve respuestas adaptadas para la interfaz.

```text
Frontend
  -> BFF
    -> ms-auth
    -> ms-user
    -> ms-kpis
    -> ms-report
```

El BFF no debe tener logica pesada de negocio. Su responsabilidad es:

- Validar formato basico del token bearer.
- Enrutar peticiones hacia microservicios.
- Manejar errores de integracion.
- Mantener al frontend desacoplado de las URLs internas.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | TypeScript |
| Runtime | Node.js 22 |
| Framework | NestJS 11.1.9 |
| TypeScript | 5.9.3 |
| Librerias | `@nestjs/common` 11.1.9, `@nestjs/core` 11.1.9, `@nestjs/platform-express` 11.1.9, `reflect-metadata` 0.2.2, `rxjs` 7.8.2 |
| Testing | Jest 30.4.2, ts-jest 29.4.6, Supertest 7.2.2, `@nestjs/testing` 11.1.9 |
| Patrones | Backend for Frontend, API Facade, Proxy, Domain Modules, HTTP Client Adapter |
| Swagger | No aplica en el BFF. Swagger esta en los microservicios Java |
| Cobertura | Jest configurado con minimo 60% global |

## Estructura

```text
src/
  main.ts
  app.module.ts
  config/
  common/
    guards/
    filters/
    dto/
    utils/
  clients/
  interfaces/
  modules/
    auth/
    users/
    kpis/
    reports/
    health/
```

## URLs importantes

| Recurso | URL |
|---|---|
| Health check | `http://localhost:8000/health` |
| Auth login | `http://localhost:8000/api/auth/login` |
| Crear usuario | `http://localhost:8000/api/users` |
| KPIs via BFF | `http://localhost:8000/api/kpis/...` |
| Reports via BFF | `http://localhost:8000/api/reports` |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `PORT` | `8000` |
| `AUTH_API_URL` | `http://localhost:8080/api/auth` |
| `USER_API_URL` | `http://localhost:8082/api/users` |
| `KPIS_API_URL` | `http://localhost:8081/api/kpis` |
| `REPORT_API_URL` | `http://localhost:8082/api/reports` |
| `ALLOWED_ORIGINS` | `http://localhost:5173` |

En Docker Compose estas URLs apuntan a nombres internos de contenedores.

## Como ejecutar

### Con Docker Compose

Desde la raiz:

```bash
docker compose up --build bff-service
```

### Local directo

```bash
cd backend/bff
npm install
npm run dev
```

## Build y tests

```bash
cd backend/bff
npm run build
npm test
```

## Endpoints y ejemplos

El BFF expone solo los endpoints usados por el frontend actual:

| Metodo | Endpoint |
|---|---|
| `GET` | `/health` |
| `POST` | `/api/auth/login` |
| `POST` | `/api/users` |
| `GET` | `/api/kpis/summary` |
| `GET` | `/api/kpis/sales/monthly` |
| `GET` | `/api/kpis/branches/performance` |
| `GET` | `/api/kpis/channels` |
| `GET` | `/api/kpis/alerts` |
| `GET` | `/api/reports` |
| `POST` | `/api/reports` |

### Health check

```bash
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{
  "status": "UP",
  "service": "bff-service"
}
```

### Login

El frontend llama al BFF, no directo a `ms-auth`.

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"vendedor\",\"password\":\"1234\"}"
```

### Crear usuario

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"email\":\"demo@cordillera.cl\",\"password\":\"1234\",\"firstName\":\"Demo\",\"lastName\":\"User\",\"role\":\"Vendedor\"}"
```

### Consultar reportes

```bash
curl http://localhost:8000/api/reports
```

### Crear reporte

```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Reporte mensual\",\"description\":\"Resumen de ventas\",\"reportType\":\"SALES\",\"status\":\"PENDING\"}"
```
