# Grupo Cordillera - Proyecto Final

Sistema de dashboard empresarial construido con frontend TypeScript, API Gateway, Backend for Frontend y microservicios Spring Boot. El proyecto esta organizado para entrega academica, ejecucion local con Docker Compose y presentacion sobre Kubernetes.

## Estructura del repositorio

```text
/backend
  /api-gateway
  /bff
  /ms-auth
  /ms-kpis
  /ms-report
  /ms-user
/frontend
/docs
  /diagramas
  /presentation.pdf
  /report.pdf
  /caso-estudio.pdf
/k8s
```

## Arquitectura general

```text
Browser
  -> Frontend React/TypeScript
  -> API Gateway KrakenD
  -> BFF Node.js/Express
  -> Microservicios Spring Boot
  -> PostgreSQL por servicio
```

El navegador consume rutas `/api/*`. El API Gateway enruta esas llamadas al BFF, y el BFF actua como fachada hacia los microservicios internos. En el escenario actual se exponen solo las rutas usadas por la UI: login, creacion de usuario, KPIs, listado de reportes y creacion de reportes.

## Componentes

| Componente | Ruta | Tecnologia | Responsabilidad |
|---|---|---|---|
| Frontend | `frontend/` | React 19.2.5, TypeScript 6.0.2, Vite 8.0.10, Tailwind CSS 4.2.4, Nginx 1.27 | UI, login, dashboard, KPIs, reportes y alertas |
| API Gateway | `backend/api-gateway/` | KrakenD 2.13 | Entrada HTTP para `/api/*` |
| BFF | `backend/bff/` | Node.js 22, NestJS 11.1.9, Express | Proxy para el frontend |
| Auth Service | `backend/ms-auth/` | Java 25, Spring Boot 4.0.6, Nimbus JOSE JWT 10.5 | Login y emision de token |
| User Service | `backend/ms-user/` | Java 25, Spring Boot 4.0.6, JPA, Flyway, PostgreSQL Driver | Gestion y persistencia de usuarios |
| KPIs Service | `backend/ms-kpis/` | Java 25, Spring Boot 4.0.6, JDBC, Flyway, PostgreSQL Driver | Indicadores del dashboard |
| Report Service | `backend/ms-report/` | Java 25, Spring Boot 4.0.6, JPA, Flyway, PostgreSQL Driver | Gestion de reportes |

## Requisitos cubiertos

- Frontend en TypeScript.
- Separacion por capas en servicios Java: controller, service, repository, dto/model.
- Global exception handlers en microservicios Java.
- Flyway para evolucion de base de datos en servicios con persistencia.
- Swagger UI mediante Springdoc OpenAPI en microservicios Java.
- Docker Compose para ejecucion local.
- Manifiestos Kubernetes e Ingress para despliegue de presentacion.
- JaCoCo/Jest configurados con umbral minimo de 60% de cobertura.

## Ejecucion local

```bash
docker compose up --build
```

URLs principales:

| Servicio | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| API Gateway | `http://localhost:8088` |
| BFF | `http://localhost:8000` |
| Auth API | `http://localhost:9080/api/auth` |
| KPIs API | `http://localhost:9081/api/kpis` |
| Users API | `http://localhost:9082/api/users` |
| Reports API | `http://localhost:9083/api/reports` |

## Kubernetes

Los manifiestos estan en `k8s/` y en `backend/ms-*/k8s/`. Ver instrucciones completas en `k8s/README.md`.

Host esperado para la presentacion:

```text
http://grupo-cordillera.local
```

## Pruebas

Cada microservicio Java usa Maven, JUnit y JaCoCo:

```bash
mvn verify
```

El BFF usa Jest y Supertest:

```bash
cd backend/bff
npm test
```

## Documentacion

La carpeta `docs/` contiene exclusivamente documentos de entrega y fuentes de diagramas:

- `docs/repore del proyecto.pdf`
- `docs/presentation.pdf`
- `docs/caso-estudio.pdf`
- `docs/coverage-report.pdf`
- `docs/diagramas/*.mmd`
