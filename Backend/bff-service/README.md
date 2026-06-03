# bff-service — Grupo Cordillera

Backend For Frontend del sistema Grupo Cordillera. Construido con **Node.js** y **Express 5**. Actúa como proxy y agregador entre `front-web2` y los microservicios Java (`auth-service` y `kpis-service`), exponiendo una API unificada al frontend.

---

## Índice

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Configuración](#4-configuración)
5. [Endpoints](#5-endpoints)
6. [Lógica interna](#6-lógica-interna)
7. [Tests](#7-tests)
8. [Ejecución local sin Docker](#8-ejecución-local-sin-docker)
9. [Dockerfile](#9-dockerfile)
10. [Rol en el monorepo](#10-rol-en-el-monorepo)

---

## 1. Descripción general

El BFF es el único punto de entrada del frontend hacia los servicios backend. Cumple dos funciones principales:

- **Proxy**: reenvía peticiones de `/api/auth/*` a `auth-service` y de `/api/kpis/*` a `kpis-service`, preservando el método HTTP, los headers y el body.
- **Agregador**: el endpoint `GET /api/dashboard` consulta los 5 endpoints de KPIs en paralelo y los combina en una sola respuesta JSON, reduciendo el número de peticiones del frontend.

El frontend **nunca llama directamente** a `auth-service` ni a `kpis-service`. Todo pasa por el BFF.

---

## 2. Stack tecnológico

| Componente    | Versión  | Uso                                             |
|---------------|----------|-------------------------------------------------|
| Node.js       | 20+      | Runtime de JavaScript del servidor              |
| Express       | 5.1.0    | Framework HTTP                                  |
| dotenv        | 16.x     | Carga de variables de entorno desde `.env`      |
| cors          | 2.8.5    | Middleware CORS configurable por orígenes       |
| Jest          | 30.x     | Framework de tests                              |
| Supertest     | 7.x      | Peticiones HTTP en tests de integración         |
| Babel         | 7.x      | Transpilación para Jest con módulos ESM         |

El proyecto usa **ES Modules** (`"type": "module"` en `package.json`).

---

## 3. Estructura del proyecto

```
bff-service/
├── Dockerfile
├── package.json
├── README.md
└── src/
    ├── index.js      ← Lógica de la aplicación (rutas, proxy, agregador)
    └── server.js     ← Punto de entrada (arranca el servidor HTTP)
```

---

## 4. Configuración

El servicio se configura mediante variables de entorno. En desarrollo local se puede usar un archivo `.env` en la raíz de `bff-service/`.

### Variables de entorno

| Variable           | Descripción                                         | Valor por defecto                   |
|--------------------|-----------------------------------------------------|-------------------------------------|
| `PORT`             | Puerto en el que escucha el servidor                | `8000`                              |
| `AUTH_API_URL`     | URL base de `auth-service`                          | `http://localhost:8080/api/auth`    |
| `KPIS_API_URL`     | URL base de `kpis-service`                          | `http://localhost:8081/api/kpis`    |
| `ALLOWED_ORIGINS`  | Orígenes CORS permitidos (separados por coma)       | `http://localhost:5173`             |

Con Docker Compose estas variables se inyectan automáticamente:

```yaml
environment:
  PORT: 8000
  AUTH_API_URL: http://auth-service:8080/api/auth
  KPIS_API_URL: http://kpis-service:8081/api/kpis
  ALLOWED_ORIGINS: http://localhost:5173
```

Notar que dentro de la red Docker los servicios se comunican por nombre de contenedor (`auth-service`, `kpis-service`), no por `localhost`.

### Puertos

| Contexto           | Puerto           |
|--------------------|------------------|
| Ejecución directa  | `localhost:8000` |
| Docker Compose     | `localhost:8000` (mapeado de `8000:8000`) |

---

## 5. Endpoints

Base URL: `http://localhost:8000`

---

### `GET /health`

Verifica que el BFF esté activo.

**Respuesta `200 OK`**:
```json
{ "status": "UP", "service": "bff-service" }
```

---

### `GET /api/dashboard`

Agrega todos los datos de KPIs en una sola respuesta. Llama en paralelo a los 5 endpoints de `kpis-service` usando `Promise.all`.

**Respuesta `200 OK`**:
```json
{
  "summary": { "ventasTotales": 1250000, "margenUtilidad": 34.5, "..." : "..." },
  "sales": [ { "mes": "Enero", "ventas": 980000, "target": 1000000 } ],
  "branches": [ { "sucursal": "Santiago Centro", "ventas": 450000, "..." : "..." } ],
  "channels": [ { "canal": "Tienda física", "porcentaje": 55.0 } ],
  "alerts": [ { "id": 1, "mensaje": "Stock crítico", "nivel": "ALTO", "estado": "ACTIVA" } ]
}
```

**Respuesta `502 Bad Gateway`** si algún servicio falla:
```json
{ "error": "Error consultando servicios internos", "status": 503 }
```

---

### `ANY /api/auth/*`

Proxy hacia `auth-service`. Reenvía cualquier método HTTP (GET, POST, etc.) manteniendo el path, query string, headers y body.

**Ejemplos**:
- `POST /api/auth/login` → `auth-service/login`
- `POST /api/auth/register` → `auth-service/register`
- `GET /api/auth/users/me` → `auth-service/users/me`
- `GET /api/auth/health` → `auth-service/health`

---

### `ANY /api/kpis/*`

Proxy hacia `kpis-service`. Reenvía cualquier método HTTP manteniendo el path, query string, headers y body.

**Ejemplos**:
- `GET /api/kpis/summary` → `kpis-service/summary`
- `GET /api/kpis/alerts` → `kpis-service/alerts`

---

## 6. Lógica interna

### Proxy genérico (`proxyRequest`)

La función `proxyRequest` construye la URL destino concatenando la URL base del servicio con el path y query string de la petición original. Luego usa el `fetch` nativo de Node.js para reenviarla.

- Solo se envía body en métodos distintos de `GET` y `HEAD`.
- Se propaga el `Content-Type` del request original.
- Se retorna la respuesta tal cual (status code + JSON o texto).

### CORS

El middleware `cors` lee la variable `ALLOWED_ORIGINS` y permite solo esos orígenes. En Docker Compose está configurado para `http://localhost:5173` (el frontend).

### Manejo de errores

Un middleware de error global captura cualquier excepción no manejada y responde con:

```json
{ "error": "Error interno del BFF", "detail": "mensaje del error" }
```

---

## 7. Tests

Los tests se ubican junto a los archivos fuente o en un directorio `__tests__/`.

Ejecutar todos los tests:

```bash
npm test
```

Modo watch (re-ejecuta al guardar):

```bash
npm run test:watch
```

Los tests usan **Supertest** para hacer peticiones HTTP reales a la aplicación sin necesidad de levantar el servidor, y **Jest** como runner y framework de aserciones.

---

## 8. Ejecución local sin Docker

```bash
cd bff-service
npm install
```

Opcionalmente, crear un archivo `.env`:

```env
PORT=8000
AUTH_API_URL=http://localhost:8080/api/auth
KPIS_API_URL=http://localhost:8081/api/kpis
ALLOWED_ORIGINS=http://localhost:5173
```

Iniciar el servidor en modo desarrollo (con hot-reload):

```bash
npm run dev
```

Iniciar el servidor en modo producción:

```bash
npm start
```

> Para que el BFF funcione correctamente en local, `auth-service` debe estar corriendo en `localhost:8080` y `kpis-service` en `localhost:8081`.

---

## 9. Dockerfile

El Dockerfile del BFF construye la imagen en un solo stage:

1. Copia `package.json` e instala dependencias de producción.
2. Copia el código fuente.
3. Expone el puerto `8000`.
4. Ejecuta `npm start`.

---

## 10. Rol en el monorepo

```
front-web2
    │
    ▼ HTTP (localhost:8000)
bff-service
    ├──► auth-service  (red interna Docker: auth-service:8080)
    └──► kpis-service  (red interna Docker: kpis-service:8081)
```

- El BFF **espera** a que `auth-service` y `kpis-service` estén saludables antes de arrancar (configurado con `depends_on` + `condition: service_healthy` en `docker-compose.yml`).
- `front-web2` **espera** a que el BFF esté saludable antes de arrancar.
- El BFF **no tiene base de datos propia**.

