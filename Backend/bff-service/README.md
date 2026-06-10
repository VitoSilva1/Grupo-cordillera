# bff-service - Grupo Cordillera

Backend For Frontend del sistema Grupo Cordillera. Esta implementado con **Node.js**, **Express 5** y **TypeScript**. Actua como punto de entrada del frontend hacia los microservicios Java, exponiendo una API unificada y adaptada a las necesidades del cliente web.

## Responsabilidades

- Proxy de `/api/auth/*` hacia `auth-service`.
- Proxy de `/api/kpis/*` hacia `kpis-service`.
- Proxy de `/api/users/*` hacia `user-service`.
- Agregacion de datos para `GET /api/dashboard`.
- Creacion coordinada de usuarios en `user-service` y credenciales en `auth-service`.
- Manejo centralizado de CORS, configuracion, errores y clientes HTTP.

## Stack

| Componente | Uso |
| --- | --- |
| Node.js 22 | Runtime |
| Express 5 | Servidor HTTP |
| TypeScript | Tipado y build |
| tsx | Desarrollo con watch |
| Jest + Supertest + ts-jest | Tests |
| dotenv | Variables de entorno |
| cors | Politica CORS configurable |

## Estructura

```txt
bff-service/
├─ Dockerfile
├─ package.json
├─ tsconfig.json
├─ jest.config.js
└─ src/
   ├─ app.ts
   ├─ server.ts
   ├─ routes.ts
   ├─ config/
   │  └─ env.ts
   ├─ modules/
   │  ├─ auth/
   │  │  └─ auth.routes.ts
   │  ├─ dashboard/
   │  │  ├─ dashboard.client.ts
   │  │  ├─ dashboard.controller.ts
   │  │  ├─ dashboard.dto.ts
   │  │  ├─ dashboard.routes.ts
   │  │  └─ dashboard.service.ts
   │  ├─ health/
   │  │  └─ health.routes.ts
   │  ├─ kpis/
   │  │  └─ kpis.routes.ts
   │  └─ users/
   │     ├─ auth-registration.client.ts
   │     ├─ users.client.ts
   │     ├─ users.controller.ts
   │     ├─ users.dto.ts
   │     ├─ users.routes.ts
   │     └─ users.service.ts
   ├─ shared/
   │  ├─ errors/
   │  │  └─ app-error.ts
   │  ├─ http/
   │  │  ├─ http-client.ts
   │  │  └─ proxy.ts
   │  └─ middlewares/
   │     └─ error.middleware.ts
   └─ test/
      └─ app.test.ts
```

## Capas

- `routes`: define endpoints publicos y monta middlewares.
- `controller`: adapta request/response de Express.
- `service`: concentra reglas del BFF, agregaciones y orquestacion.
- `client`: encapsula llamadas HTTP a microservicios internos.
- `dto`: contratos TypeScript de entrada/salida.
- `shared`: utilidades transversales reutilizables.
- `config`: lectura centralizada de variables de entorno.

## Variables de entorno

| Variable | Descripcion | Valor por defecto |
| --- | --- | --- |
| `PORT` | Puerto del BFF | `8000` |
| `AUTH_API_URL` | URL base de auth-service | `http://localhost:8080/api/auth` |
| `KPIS_API_URL` | URL base de kpis-service | `http://localhost:8081/api/kpis` |
| `USER_API_URL` | URL base de user-service | `http://localhost:8082/api/users` |
| `ALLOWED_ORIGINS` | Origenes CORS separados por coma | `http://localhost:5173` |

## Endpoints

### `GET /health`

```json
{ "status": "UP", "service": "bff-service" }
```

### `GET /api/dashboard`

Consulta en paralelo:

- `/summary`
- `/sales/monthly`
- `/branches/performance`
- `/channels`
- `/alerts`

Respuesta:

```json
{
  "summary": {},
  "sales": [],
  "branches": [],
  "channels": [],
  "alerts": []
}
```

Si algun servicio interno falla:

```json
{ "error": "Error consultando servicios internos", "status": 503 }
```

### `POST /api/users`

Crea el usuario operacional en `user-service` y registra credenciales en `auth-service`.

### `ANY /api/auth/*`, `ANY /api/kpis/*`, `ANY /api/users/*`

Proxy hacia el microservicio correspondiente. Se conserva metodo HTTP, query string, body JSON, `Accept`, `Content-Type` y `Authorization`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm start
npm test
```

## Docker

El contenedor compila TypeScript durante el build de imagen y ejecuta el resultado desde `dist/server.js`.

```bash
docker build -t grupo-cordillera-bff-service .
docker run --rm -p 8000:8000 grupo-cordillera-bff-service
```
