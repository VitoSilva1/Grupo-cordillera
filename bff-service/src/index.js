import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT || 8000);
const AUTH_API_URL = process.env.AUTH_API_URL || 'http://localhost:8080/api/auth';
const KPIS_API_URL = process.env.KPIS_API_URL || 'http://localhost:8081/api/kpis';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

function buildHeaders(incomingHeaders) {
  const headers = { Accept: 'application/json' };
  const contentType = incomingHeaders['content-type'];
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}

async function proxyRequest(req, res, baseUrl) {
  const proxyUrl = `${baseUrl}${req.path}${new URLSearchParams(req.query).toString() ? `?${new URLSearchParams(req.query)}` : ''}`;
  const response = await fetch(proxyUrl, {
    method: req.method,
    headers: buildHeaders(req.headers),
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  return res.status(response.status).send(payload);
}

function forward(baseUrl) {
  return async (req, res, next) => {
    try {
      await proxyRequest(req, res, baseUrl);
    } catch (error) {
      next(error);
    }
  };
}

app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'bff-service' });
});

app.get('/api/dashboard', async (_req, res, next) => {
  try {
    const endpoints = [
      '/summary',
      '/sales/monthly',
      '/branches/performance',
      '/channels',
      '/alerts',
    ];

    const responses = await Promise.all(
      endpoints.map((path) => fetch(`${KPIS_API_URL}${path}`))
    );

    const failed = responses.find((response) => !response.ok);
    if (failed) {
      return res.status(502).json({
        error: 'Error consultando servicios internos',
        status: failed.status,
      });
    }

    const [summary, sales, branches, channels, alerts] = await Promise.all(
      responses.map((response) => response.json())
    );

    return res.json({ summary, sales, branches, channels, alerts });
  } catch (error) {
    return next(error);
  }
});

app.use('/api/auth', forward(AUTH_API_URL));
app.use('/api/kpis', forward(KPIS_API_URL));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: 'Error interno del BFF',
    detail: error instanceof Error ? error.message : 'unknown',
  });
});

export default app;
