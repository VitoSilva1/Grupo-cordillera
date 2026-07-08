import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from './app.module';

const jsonResponse = (payload: unknown, ok = true, status = 200): Response =>
  ({
    ok,
    status,
    headers: {
      get: () => 'application/json',
    },
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  }) as unknown as Response;

describe('BFF NestJS', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.spyOn(global, 'fetch').mockReset();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it('returns health status', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'UP', service: 'bff-service' });
  });

  it('proxies report requests', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(jsonResponse([{ id: 1 }]));

    await request(app.getHttpServer()).get('/api/reports?type=latest').expect(200);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/reports?type=latest'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('proxies report creation requests', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(jsonResponse({ id: 2 }, true, 201));

    await request(app.getHttpServer())
      .post('/api/reports')
      .send({
        title: 'Reporte mensual',
        description: 'Resumen de ventas',
        reportType: 'SALES',
        status: 'PENDING',
      })
      .expect(201);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/reports'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('proxies login requests', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(jsonResponse({ accessToken: 'token' }));

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'vendedor', password: '1234' })
      .expect(200);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('proxies user creation requests', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(jsonResponse({ id: 1 }, true, 201));

    await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: 'demo',
        email: 'demo@cordillera.cl',
        password: '1234',
        firstName: 'Demo',
        lastName: 'User',
        role: 'Vendedor',
      })
      .expect(201);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('proxies KPI summary requests', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(jsonResponse({ ventasTotales: 100 }));

    await request(app.getHttpServer()).get('/api/kpis/summary').expect(200);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/kpis/summary'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('does not expose the removed dashboard aggregate endpoint', async () => {
    await request(app.getHttpServer()).get('/api/dashboard').expect(404);
  });
});
