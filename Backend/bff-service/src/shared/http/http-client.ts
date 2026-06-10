import { AppError } from '../errors/app-error.js';

export interface HttpResult<T> {
  status: number;
  ok: boolean;
  data: T;
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string): Promise<HttpResult<T>> {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<TResponse, TBody>(path: string, body: TBody): Promise<HttpResult<TResponse>> {
    return this.request<TResponse>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<HttpResult<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    const data = await readResponseBody<T>(response);

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  }
}

export async function readResponseBody<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}

export function assertOk<T>(result: HttpResult<T>, message: string): T {
  if (!result.ok) {
    throw new AppError(message, 502, { status: result.status, payload: result.data });
  }

  return result.data;
}
