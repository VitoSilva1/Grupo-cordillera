# bff-service

Backend for Frontend para centralizar las llamadas del frontend a `auth-service` y `kpis-service`.

## Ejecutar

```bash
cd bff-service
npm install
cp .env.example .env
npm run dev
```

Servidor por defecto: `http://localhost:8000`.

## Endpoints

- `GET /health`
- `GET /api/dashboard`
- Proxy auth: `/api/auth/*`
- Proxy kpis: `/api/kpis/*`
