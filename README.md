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

## Observabilidad con GlitchTip

GlitchTip se usa como servidor compatible con Sentry para recibir eventos de error del frontend, BFF y microservicios. No reemplaza los logs de consola de Kubernetes: GlitchTip agrupa excepciones como issues, mientras que `kubectl logs` sigue siendo la fuente para logs normales de contenedor.

Flujo general:

```text
Frontend React -> @sentry/react -> GlitchTip
BFF NestJS -> @sentry/node -> GlitchTip
Microservicios Spring Boot -> logs con kubectl
```

Nota: los microservicios Java mantienen la variable `GLITCHTIP_DSN` en sus `ConfigMap`, pero el starter automatico de Sentry fue retirado porque la version usada no es compatible con Spring Boot 4.0.6 y provocaba `CrashLoopBackOff`. Para esos servicios, la observabilidad operativa actual se revisa con `kubectl logs`.

### Levantar GlitchTip con Docker

Desde la raiz del proyecto:

```powershell
docker compose -f docker-compose-glitchtip.yml up -d
```

Verificar contenedores:

```powershell
docker compose -f docker-compose-glitchtip.yml ps
```

Abrir GlitchTip:

```text
http://localhost:8000
```

Si es la primera ejecucion o la base esta vacia, aplicar migraciones:

```powershell
docker compose -f docker-compose-glitchtip.yml exec web ./manage.py migrate
```

Crear usuario administrador:

```powershell
docker compose -f docker-compose-glitchtip.yml exec web ./manage.py createsuperuser
```

Luego entrar a `http://localhost:8000`, crear los proyectos necesarios y copiar sus DSN.

### Configuracion de DSN

El frontend corre en el navegador del usuario, por lo que puede apuntar a GlitchTip con `localhost`:

```text
http://CLAVE_PUBLICA@localhost:8000/ID_PROYECTO_FRONTEND
```

El BFF y los microservicios corren dentro de Kubernetes. Para que esos pods lleguen al GlitchTip levantado en Docker Desktop, deben usar `host.docker.internal`:

```text
http://CLAVE_PUBLICA@host.docker.internal:8000/ID_PROYECTO_BACKEND
```

Archivos principales:

```text
frontend/Dockerfile
frontend/src/main.tsx
docker-compose.yml
k8s/config.yaml
backend/bff/src/instrument.ts
backend/ms-auth/k8s/configmap.yaml
backend/ms-user/k8s/configmap.yaml
backend/ms-kpis/k8s/configmap.yaml
backend/ms-report/k8s/configmap.yaml
```

### Levantar el proyecto en Kubernetes

Antes de desplegar, construir las imagenes locales:

```powershell
docker compose build
```

Aplicar los manifiestos:

```powershell
kubectl apply -k .
```

Reiniciar los deployments para que tomen imagenes y `ConfigMap` actualizados:

```powershell
kubectl rollout restart deployment/auth-service -n grupo-cordillera
kubectl rollout restart deployment/user-service -n grupo-cordillera
kubectl rollout restart deployment/kpis-service -n grupo-cordillera
kubectl rollout restart deployment/report-service -n grupo-cordillera
kubectl rollout restart deployment/bff-service -n grupo-cordillera
kubectl rollout restart deployment/api-gateway -n grupo-cordillera
kubectl rollout restart deployment/front-web2 -n grupo-cordillera
```

Verificar estado:

```powershell
kubectl get pods -n grupo-cordillera
kubectl get ingress -n grupo-cordillera
```

Abrir la aplicacion:

```text
http://grupo-cordillera.local
```

Si el host no resuelve, agregar esta linea al archivo `C:\Windows\System32\drivers\etc\hosts` como administrador:

```text
127.0.0.1 grupo-cordillera.local
```

### Ver logs e issues

Logs normales de Kubernetes:

```powershell
kubectl logs -n grupo-cordillera deployment/front-web2 -f
kubectl logs -n grupo-cordillera deployment/bff-service -f
kubectl logs -n grupo-cordillera deployment/auth-service -f
kubectl logs -n grupo-cordillera deployment/user-service -f
kubectl logs -n grupo-cordillera deployment/kpis-service -f
kubectl logs -n grupo-cordillera deployment/report-service -f
```

Eventos del cluster:

```powershell
kubectl get events -n grupo-cordillera --sort-by=.lastTimestamp
```

Issues de GlitchTip:

```text
http://localhost:8000 -> Organization -> Project -> Issues
```

GlitchTip muestra excepciones agrupadas con stack trace, ambiente, fecha, URL y cantidad de ocurrencias. Los mensajes normales de `console.log`, `log.info` o logs de arranque se revisan con `kubectl logs`.

Para verificar que los pods tienen DSN:

```powershell
kubectl exec -n grupo-cordillera deployment/bff-service -- printenv GLITCHTIP_DSN
kubectl exec -n grupo-cordillera deployment/auth-service -- printenv GLITCHTIP_DSN
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
