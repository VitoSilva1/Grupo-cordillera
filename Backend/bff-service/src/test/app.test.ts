import request from 'supertest';

import app from '../app.js';

describe('GET /health', () => {
  it('should return status UP and service name', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'UP',
      service: 'bff-service',
    });
  });
});
