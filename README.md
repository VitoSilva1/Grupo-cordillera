# Grupo Cordillera — Monorepo

Sistema de panel de KPIs empresariales construido con una arquitectura de microservicios. Permite a los usuarios autenticarse y visualizar indicadores de negocio como ventas, márgenes, desempeño por sucursal, canales de venta y alertas operacionales.

---

## Arquitectura general

```
Navegador
    │
    ▼
front-web2  (React + Vite + TypeScript)  :5173
    │
    ▼ HTTP REST
bff-service  (Node.js + Express)         :8000
    ├──► auth-service  (Spring Boot)     :9080  ──► auth-db  (PostgreSQL :5433)
    ├──► kpis-service  (Spring Boot)     :9081  ──► kpis-db  (PostgreSQL :5434)
    └──► user-service  (Spring Boot)     :9082  ──► user-db  (PostgreSQL :5435)
```

- El navegador solo habla con el **BFF** (`localhost:8000`).
- El **BFF** actúa como proxy y agrega datos hacia los microservicios internos.
- Cada microservicio Java tiene su **propia base de datos PostgreSQL** con migraciones independientes gestionadas por Flyway.

---

## Servicios del monorepo

| Directorio     | Tecnología                      | Descripción                                        |
|----------------|---------------------------------|----------------------------------------------------|
| `front-web2/`  | React 19, TypeScript 6, Vite 8  | Panel web principal con login y dashboard de KPIs  |
| `bff-service/` | Node.js, Express 5, ESM         | Proxy y agregador entre frontend y microservicios  |
| `auth-service/`| Java 25, Spring Boot 4          | Autenticación, registro y gestión de usuarios      |
| `user-service/`| Java 25, Spring Boot 4          | Creación y consulta de usuarios                    |
| `kpis-service/`| Java 25, Spring Boot 4          | Indicadores de negocio y datos del dashboard       |
| `front-web/`   | React (CRA)                     | Frontend legacy (no activo en Docker)              |

---

## Requisitos previos

- **Docker** y **Docker Compose** (recomendado para levantar todo el stack)
- **Java 25** y **Maven 3.9+** (solo si ejecutas los servicios Java localmente)
- **Node.js 20+** y **npm** (solo si ejecutas bff o front localmente)

---

## Levantar el stack completo con Docker

Desde la raíz del repositorio:

```bash
docker compose up --build
```

En segundo plano:

```bash
docker compose up -d --build
```

Ver estado de los contenedores:

```bash
docker compose ps
```

Ver logs de un servicio específico:

```bash
docker compose logs -f bff-service
```

Detener y eliminar contenedores:

```bash
docker compose down
```

Eliminar también volúmenes (borra los datos de las bases):

```bash
docker compose down -v
```

### Orden de arranque

Docker Compose respeta las dependencias mediante `healthcheck`:

1. `auth-db`, `kpis-db` y `user-db` (PostgreSQL) arrancan primero.
2. `auth-service`, `kpis-service` y `user-service` esperan a que sus bases de datos estén saludables.
3. `bff-service` espera a que los microservicios Java estén saludables.
4. `front-web2` espera a que el BFF esté saludable.

---

## Puertos expuestos

| Servicio       | URL local                  | Puerto interno |
|----------------|----------------------------|----------------|
| Frontend       | http://localhost:5173      | 80             |
| BFF            | http://localhost:8000      | 8000           |
| Auth API       | http://localhost:9080      | 8080           |
| KPIs API       | http://localhost:9081      | 8081           |
| Users API      | http://localhost:9082      | 8082           |
| Auth DB        | localhost:5433             | 5432           |
| KPIs DB        | localhost:5434             | 5432           |
| Users DB       | localhost:5435             | 5432           |

---

## Endpoints principales

### Auth Service (`/api/auth`)

| Método | Ruta               | Descripción                          |
|--------|--------------------|--------------------------------------|
| GET    | `/health`          | Health check del servicio            |
| POST   | `/login`           | Autenticar usuario (username/email)  |
| POST   | `/register`        | Registrar nuevo usuario              |
| GET    | `/users/me`        | Perfil del usuario actual            |
| GET    | `/users`           | Listar todos los usuarios            |

### KPIs Service (`/api/kpis`)

| Método | Ruta                    | Descripción                        |
|--------|-------------------------|------------------------------------|
| GET    | `/health`               | Health check del servicio          |
| GET    | `/summary`              | Resumen general de KPIs            |
| GET    | `/sales/monthly`        | Ventas mensuales                   |
| GET    | `/branches/performance` | Desempeño por sucursal             |
| GET    | `/channels`             | Ventas por canal                   |
| GET    | `/alerts`               | Alertas operacionales activas      |
| GET    | `/{type}`               | KPI por tipo (enum `KpiType`)      |

### User Service (`/api/users`)

| Método | Ruta          | Descripción                   |
|--------|---------------|-------------------------------|
| GET    | `/health`     | Health check del servicio     |
| POST   | `/`           | Crear un nuevo usuario        |
| GET    | `/`           | Listar usuarios               |
| GET    | `/{username}` | Buscar usuario por username   |

### BFF Service

| Método | Ruta              | Descripción                                      |
|--------|-------------------|--------------------------------------------------|
| GET    | `/health`         | Health check del BFF                             |
| GET    | `/api/dashboard`  | Agrega todos los KPIs en una sola respuesta      |
| ANY    | `/api/auth/*`     | Proxy hacia auth-service                         |
| ANY    | `/api/kpis/*`     | Proxy hacia kpis-service                         |
| ANY    | `/api/users/*`    | Proxy hacia user-service                         |

---

## Migraciones de base de datos

Cada microservicio administra sus propias migraciones con **Flyway**. Los scripts se ejecutan en orden al arrancar el servicio y el historial queda registrado en la tabla `flyway_schema_history` de cada base.

### auth-service

```
src/main/resources/db/migration/
├── V1__create_users_table.sql                    → Crea la tabla users
├── V2__seed_default_users.sql                    → Inserta usuarios de prueba
└── V3__normalize_users_seed_and_email_index.sql  → Normaliza datos e índice de email
```

### kpis-service

```
src/main/resources/db/migration/
├── V1__create_kpis_schema.sql     → Crea tablas: kpi_summary, monthly_sales, branch_performance, sales_channels, alerts
├── V2__seed_kpis_data.sql         → Inserta datos iniciales de KPIs
└── V3__upsert_kpis_seed_data.sql  → Actualiza/inserta datos de seed
```

### user-service

```
src/main/resources/db/migration/
└── V1__create_users_table.sql  → Crea la tabla users
```

---

## Variables de entorno

### auth-service

| Variable                  | Valor por defecto                              |
|---------------------------|------------------------------------------------|
| `SPRING_DATASOURCE_URL`   | `jdbc:postgresql://localhost:5433/auth_db`     |
| `SPRING_DATASOURCE_USERNAME` | `auth_user`                                 |
| `SPRING_DATASOURCE_PASSWORD` | `auth_pass`                                 |

### kpis-service

| Variable                  | Valor por defecto                              |
|---------------------------|------------------------------------------------|
| `SPRING_DATASOURCE_URL`   | `jdbc:postgresql://localhost:5434/kpis_db`     |
| `SPRING_DATASOURCE_USERNAME` | `kpis_user`                                 |
| `SPRING_DATASOURCE_PASSWORD` | `kpis_pass`                                 |

### user-service

| Variable                  | Valor por defecto                              |
|---------------------------|------------------------------------------------|
| `SPRING_DATASOURCE_URL`   | `jdbc:postgresql://localhost:5435/user_db`     |
| `SPRING_DATASOURCE_USERNAME` | `user_user`                                 |
| `SPRING_DATASOURCE_PASSWORD` | `user_pass`                                 |

### bff-service

| Variable           | Valor por defecto                        |
|--------------------|------------------------------------------|
| `PORT`             | `8000`                                   |
| `AUTH_API_URL`     | `http://localhost:8080/api/auth`         |
| `KPIS_API_URL`     | `http://localhost:8081/api/kpis`         |
| `USER_API_URL`     | `http://localhost:8082/api/users`        |
| `ALLOWED_ORIGINS`  | `http://localhost:5173`                  |

### front-web2

| Variable              | Valor por defecto                   |
|-----------------------|-------------------------------------|
| `VITE_USERS_API_URL`  | `http://localhost:8000/api/auth`    |

---

## Estructura del monorepo

```
Grupo-cordillera/
├── docker-compose.yml      ← Orquestación completa del stack
├── .gitignore
├── README.md
├── front-web2/             ← Frontend principal (React + Vite + TypeScript)
├── bff-service/            ← Backend For Frontend (Node.js + Express)
├── auth-service/           ← Microservicio de autenticación (Spring Boot)
├── user-service/           ← Microservicio de usuarios (Spring Boot)
├── kpis-service/           ← Microservicio de KPIs (Spring Boot)
└── front-web/              ← Frontend legacy (React CRA, no activo)
```

---

## Convenciones del proyecto

- **Base de datos por microservicio**: cada servicio Java tiene su propio contenedor PostgreSQL y nunca comparte base con otro.
- **BFF como único punto de entrada**: el frontend no llama directamente a los microservicios Java.
- **Migraciones versionadas**: los scripts Flyway siguen el formato `V{N}__{descripcion}.sql` y nunca se modifican una vez aplicados.
- **Health checks**: todos los servicios exponen un endpoint `/health` que Docker Compose usa para determinar el orden de arranque.
- **Sin autenticación JWT por ahora**: el login devuelve datos del usuario directamente; la sesión se maneja en el estado del frontend.
