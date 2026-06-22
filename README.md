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

El navegador consume rutas `/api/*`. El API Gateway enruta esas llamadas al BFF, y el BFF actua como fachada hacia los microservicios internos. El endpoint `/api/dashboard` agrega datos de KPIs en una respuesta unica.

## Componentes

| Componente | Ruta | Tecnologia | Responsabilidad |
|---|---|---|---|
| Frontend | `frontend/` | React, TypeScript, Vite, Tailwind CSS | UI, login, dashboard, KPIs y alertas |
| API Gateway | `backend/api-gateway/` | KrakenD | Entrada HTTP para `/api/*` |
| BFF | `backend/bff/` | Node.js, Express | Proxy y agregacion para el frontend |
| Auth Service | `backend/ms-auth/` | Java, Spring Boot, JWT | Login, registro y emision de token |
| User Service | `backend/ms-user/` | Java, Spring Boot, JPA, Flyway | Gestion y persistencia de usuarios |
| KPIs Service | `backend/ms-kpis/` | Java, Spring Boot, JDBC, Flyway | Indicadores del dashboard |
| Report Service | `backend/ms-report/` | Java, Spring Boot, JPA, Flyway | Gestion de reportes |

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

- `docs/report.pdf`
- `docs/presentation.pdf`
- `docs/caso-estudio.pdf`
- `docs/diagramas/*.mmd`
