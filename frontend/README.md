# frontend - Grupo Cordillera

Aplicacion web principal del dashboard Grupo Cordillera. Esta construida en TypeScript y consume exclusivamente rutas `/api/*` expuestas por el API Gateway/BFF. En contenedor se sirve con Nginx, que tambien proxy pasa `/api/` hacia `api-gateway:8088`.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | TypeScript |
| Framework UI | React 19 |
| Build tool | Vite 8 |
| Librerias | Tailwind CSS, Recharts, wouter, lucide-react, `@sentry/react` |
| Patrones | Component-based UI, Services Layer, Strategy para tarjetas/alertas |
| Runtime contenedor | Nginx sirviendo archivos estaticos |
| Observabilidad | GlitchTip/Sentry en `src/main.tsx` |

## Responsabilidad

- Login y manejo de sesion del usuario.
- Dashboard de KPIs.
- Vista detallada de KPIs.
- Vista de alertas.
- Vista de reportes y creacion de reportes.
- Formulario de creacion de usuarios.
- Captura de errores frontend hacia GlitchTip cuando `VITE_GLITCHTIP_DSN` esta configurado.

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `VITE_USERS_API_URL` | `/api/auth` |
| `VITE_USER_API_URL` | `/api/users` |
| `VITE_KPIS_API_URL` | `/api/kpis` |
| `VITE_REPORTS_API_URL` | `/api/reports` |
| `VITE_GLITCHTIP_DSN` | DSN del proyecto frontend en GlitchTip |

En Docker Compose y Kubernetes el frontend ya queda construido para llamar rutas relativas `/api/*`. En Kubernetes, el Ingress envia `/api` al `api-gateway`; en Docker Compose, el Nginx del frontend proxy pasa `/api/` al contenedor `api-gateway`.

El DSN de GlitchTip del frontend usa `localhost:8000` porque el codigo corre en el navegador del usuario:

```text
http://CLAVE_PUBLICA@localhost:8000/ID_PROYECTO_FRONTEND
```

## Ejecucion local

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
```

## Lint

```bash
cd frontend
npm run lint
```

## Docker

```bash
docker compose up --build front-web2
```

La imagen resultante se llama `grupo-cordillera-front-web2:latest` y es la misma que usan los manifiestos Kubernetes.
