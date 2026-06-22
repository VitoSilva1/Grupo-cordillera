import { BadGatewayException } from '@nestjs/common';
import { Request, Response } from 'express';

const buildHeaders = (request: Request): Record<string, string> => {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const contentType = request.headers['content-type'];
  const authorization = request.headers.authorization;

  if (typeof contentType === 'string') {
    headers['Content-Type'] = contentType;
  }
  if (typeof authorization === 'string') {
    headers.Authorization = authorization;
  }

  return headers;
};

const parsePayload = async (response: globalThis.Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('application/json')
    ? response.json()
    : response.text();
};

export async function proxyRequest(
  request: Request,
  response: Response,
  baseUrl: string,
  publicPrefix: string,
): Promise<void> {
  const targetPath = request.originalUrl.replace(publicPrefix, '') || '';
  const targetUrl = `${baseUrl}${targetPath}`;
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers: buildHeaders(request),
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : JSON.stringify(request.body ?? {}),
  });
  const payload = await parsePayload(upstream);
  response.status(upstream.status).send(payload);
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new BadGatewayException({
      error: 'Error consultando servicios internos',
      status: response.status,
    });
  }

  return response.json() as Promise<T>;
}
