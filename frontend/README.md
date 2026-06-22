# frontend - Grupo Cordillera

Aplicacion web principal del dashboard Grupo Cordillera. Esta construida en TypeScript y consume exclusivamente rutas `/api/*` expuestas por el API Gateway/BFF.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | TypeScript |
| Framework UI | React 19 |
| Build tool | Vite 8 |
| Librerias | Tailwind CSS, Recharts, wouter, lucide-react |
| Patrones | Component-based UI, Services Layer, Strategy para tarjetas/alertas |
| Runtime contenedor | Nginx sirviendo archivos estaticos |

## Responsabilidad

- Login y manejo de sesion del usuario.
- Dashboard de KPIs.
- Vista detallada de KPIs.
- Vista de alertas.
- Formulario de creacion de usuarios.

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `VITE_USERS_API_URL` | `/api/auth` |
| `VITE_USER_API_URL` | `/api/users` |
| `VITE_KPIS_API_URL` | `/api/kpis` |

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
