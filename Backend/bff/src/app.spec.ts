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

  it('aggregates dashboard data', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ username: 'manager' }))
      .mockResolvedValueOnce(jsonResponse({ totalSales: 100 }))
      .mockResolvedValueOnce(jsonResponse([{ month: 'Jan', sales: 50 }]))
      .mockResolvedValueOnce(jsonResponse([{ branch: 'Central', performance: 90 }]))
      .mockResolvedValueOnce(jsonResponse([{ channel: 'Web', value: 40 }]))
      .mockResolvedValueOnce(jsonResponse([{ id: '1', status: 'INFO' }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 1, title: 'Monthly' }]));

    const response = await request(app.getHttpServer()).get('/api/dashboard').expect(200);

    expect(response.body).toEqual({
      user: { username: 'manager' },
      summary: { totalSales: 100 },
      sales: [{ month: 'Jan', sales: 50 }],
      branches: [{ branch: 'Central', performance: 90 }],
      channels: [{ channel: 'Web', value: 40 }],
      alerts: [{ id: '1', status: 'INFO' }],
      reports: [{ id: 1, title: 'Monthly' }],
    });
  });

  it('proxies report requests', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(jsonResponse([{ id: 1 }]));

    await request(app.getHttpServer()).get('/api/reports?type=latest').expect(200);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/reports?type=latest'),
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
