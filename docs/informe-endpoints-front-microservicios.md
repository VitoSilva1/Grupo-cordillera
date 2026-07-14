# Informe tecnico de endpoints y arquitectura - Grupo Cordillera

## 1. Objetivo

Este documento describe el flujo real entre frontend, API Gateway, BFF, microservicios y bases de datos del proyecto Grupo Cordillera. La informacion esta alineada con los archivos actuales del repositorio.

## 2. Arquitectura actual

```text
Browser
  -> front-web2 React/TypeScript servido por Nginx
  -> API Gateway KrakenD
  -> BFF NestJS
  -> ms-auth / ms-user / ms-kpis / ms-report
  -> PostgreSQL por dominio
```

En Docker Compose, el frontend se publica en `http://localhost:5173` y su Nginx reenvia `/api/` a `api-gateway:8088`.

En Kubernetes, el Ingress usa el host `grupo-cordillera.local`:

| Path | Destino |
|---|---|
| `/` | `front-web2:80` |
| `/api` | `api-gateway:8088` |

## 3. Componentes

| Componente | Ruta | Tecnologia | Responsabilidad |
|---|---|---|---|
| Frontend | `frontend/` | React, TypeScript, Vite, Nginx, `@sentry/react` | Pantallas de login, usuarios, dashboard, KPIs, alertas y reportes |
| API Gateway | `backend/api-gateway/` | KrakenD | Entrada HTTP explicita para rutas `/api/*` |
| BFF | `backend/bff/` | NestJS, TypeScript, `@sentry/node` | Proxy hacia microservicios y eventos GlitchTip del backend Node |
| Auth Service | `backend/ms-auth/` | Spring Boot, JWT RS256 | Login y emision de JWT; delega usuarios a `ms-user` |
| User Service | `backend/ms-user/` | Spring Boot, JPA, Flyway | Gestion de usuarios en `user_db` |
| KPIs Service | `backend/ms-kpis/` | Spring Boot, JDBC, Flyway | Indicadores, graficos y alertas en `kpis_db` |
| Report Service | `backend/ms-report/` | Spring Boot, JPA, Flyway | Creacion y listado de reportes en `report_db` |

## 4. Rutas publicas expuestas por el gateway

El gateway no es wildcard. Las rutas publicas declaradas en `backend/api-gateway/krakend.json` son:

| Metodo | Ruta publica | BFF | Microservicio final |
|---|---|---|---|
| `GET` | `/health` | `/health` | BFF |
| `POST` | `/api/auth/login` | Auth module | `ms-auth`, luego `ms-user` |
| `POST` | `/api/users` | Users module | `ms-user` |
| `GET` | `/api/kpis/summary` | KPIs module | `ms-kpis` |
| `GET` | `/api/kpis/sales/monthly` | KPIs module | `ms-kpis` |
| `GET` | `/api/kpis/branches/performance` | KPIs module | `ms-kpis` |
| `GET` | `/api/kpis/channels` | KPIs module | `ms-kpis` |
| `GET` | `/api/kpis/alerts` | KPIs module | `ms-kpis` |
| `GET` | `/api/reports` | Reports module | `ms-report` |
| `POST` | `/api/reports` | Reports module | `ms-report` |

`GET /api/dashboard`, `/api/auth/register`, `/api/auth/public-key`, `/api/users/authenticate`, `/api/kpis/{type}` y `/api/reports/{id}` no son parte del contrato publico actual del gateway.

## 5. BFF

El BFF esta implementado en `backend/bff/` y expone solo las rutas usadas por el frontend actual.

Variables internas principales:

| Variable | Valor local por defecto | En contenedor/Kubernetes |
|---|---|---|
| `AUTH_API_URL` | `http://localhost:8080/api/auth` | `http://auth-service:8080/api/auth` |
| `USER_API_URL` | `http://localhost:8082/api/users` | `http://user-service:8082/api/users` |
| `KPIS_API_URL` | `http://localhost:8081/api/kpis` | `http://kpis-service:8081/api/kpis` |
| `REPORT_API_URL` | `http://localhost:8082/api/reports` | `http://report-service:8082/api/reports` |

Nota: `ms-report` escucha internamente en `8082`; Docker Compose lo publica hacia el host como `9083`.

## 6. Flujos principales

### Login

```text
Login.tsx
  -> POST /api/auth/login
  -> API Gateway KrakenD
  -> BFF AuthController
  -> ms-auth POST /api/auth/login
  -> ms-user POST /api/users/authenticate
  -> user_db.users
  -> ms-auth genera JWT RS256
  -> BFF registra business_metric=login_success
  -> frontend guarda perfil en sessionStorage
```

### Crear usuario

```text
CreateUser.tsx
  -> POST /api/users
  -> API Gateway
  -> BFF UsersController
  -> ms-user POST /api/users
  -> UserRepository.save()
  -> user_db.users
```

### Dashboard y KPIs

El dashboard de React llama directamente estos endpoints:

```text
GET /api/kpis/summary
GET /api/kpis/sales/monthly
GET /api/kpis/branches/performance
GET /api/kpis/channels
GET /api/kpis/alerts
```

Cada llamada fluye por gateway, BFF y `ms-kpis`, que consulta `kpis_db`.

### Reportes

La vista `frontend/src/views/ReportsView.tsx` consume:

```text
GET /api/reports
POST /api/reports
```

El BFF reenvia esas solicitudes a `ms-report`. Cuando un `POST /api/reports` termina exitosamente, el BFF registra:

```text
business_metric=report_created total_reports_created=N
```

## 7. Observabilidad

GlitchTip recibe eventos desde:

- Frontend mediante `@sentry/react`.
- BFF mediante `@sentry/node`.

El BFF envia a GlitchTip los mensajes:

```text
Login exitoso
Reporte creado
```

Los microservicios Java no tienen SDK Sentry activo en el `pom.xml`; se observan con logs de contenedor:

```powershell
kubectl logs -n grupo-cordillera deployment/auth-service -f
kubectl logs -n grupo-cordillera deployment/user-service -f
kubectl logs -n grupo-cordillera deployment/kpis-service -f
kubectl logs -n grupo-cordillera deployment/report-service -f
```

## 8. Persistencia

| Servicio | Base | Puerto host en Docker | Puerto interno |
|---|---|---|---|
| `ms-user` | `user_db` | `5435` | `5432` |
| `ms-kpis` | `kpis_db` | `5434` | `5432` |
| `ms-report` | `report_db` | `5436` | `5432` |
| `ms-auth` | No tiene base propia | No aplica | No aplica |

`ms-user`, `ms-kpis` y `ms-report` usan Flyway para crear y poblar sus esquemas.

## 9. Patrones

- API Gateway con KrakenD.
- Backend for Frontend con NestJS.
- Microservicios por dominio.
- Database per service para usuarios, KPIs y reportes.
- Repository y Service Layer en Java.
- DTO para contratos HTTP.
- Strategy y Factory en KPIs.
- Client Adapter en `ms-auth` para consumir `ms-user`.
- Manejo centralizado de errores con `RestExceptionHandler` y filtros del BFF.
