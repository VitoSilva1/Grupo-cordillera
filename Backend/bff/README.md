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
- Agregar respuestas cuando el frontend necesita una vista compuesta.
- Manejar errores de integracion.
- Mantener al frontend desacoplado de las URLs internas.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | TypeScript |
| Runtime | Node.js 22 |
| Framework | NestJS 11 |
| Librerias | `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs` |
| Testing | Jest, ts-jest, Supertest, `@nestjs/testing` |
| Patrones | Backend for Frontend, API Facade, Proxy, Aggregator, Domain Modules, HTTP Client Adapter |
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
| Dashboard agregado | `http://localhost:8000/api/dashboard` |
| Auth via BFF | `http://localhost:8000/api/auth/*` |
| Users via BFF | `http://localhost:8000/api/users/*` |
| KPIs via BFF | `http://localhost:8000/api/kpis/*` |
| Reports via BFF | `http://localhost:8000/api/reports/*` |

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

### Consultar dashboard agregado

```bash
curl http://localhost:8000/api/dashboard
```

El BFF arma una respuesta con:

- Usuario actual desde `ms-auth`.
- Resumen de KPIs desde `ms-kpis`.
- Ventas, sucursales, canales y alertas desde `ms-kpis`.
- Reportes desde `ms-report`.

### Consultar reportes

```bash
curl http://localhost:8000/api/reports
```
