import type { Request, RequestHandler } from 'express';

import { readResponseBody } from './http-client.js';

const BODYLESS_METHODS = new Set(['GET', 'HEAD']);
const FORWARDED_HEADERS = ['authorization', 'content-type', 'accept'];

function buildHeaders(req: Request): HeadersInit {
  const headers: Record<string, string> = { Accept: 'application/json' };

  for (const headerName of FORWARDED_HEADERS) {
    const value = req.headers[headerName];
    if (typeof value === 'string') {
      headers[headerName] = value;
    }
  }

  return headers;
}

function buildProxyUrl(req: Request, baseUrl: string): string {
  const targetPath = req.path === '/' ? '' : req.path;
  const queryString = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';

  return `${baseUrl}${targetPath}${queryString}`;
}

export function createProxyHandler(baseUrl: string): RequestHandler {
  return async (req, res, next) => {
    try {
      const response = await fetch(buildProxyUrl(req, baseUrl), {
        method: req.method,
        headers: buildHeaders(req),
        body: BODYLESS_METHODS.has(req.method) ? undefined : JSON.stringify(req.body),
      });

      const payload = await readResponseBody(response);
      res.status(response.status).send(payload);
    } catch (error) {
      next(error);
    }
  };
}
