import Fastify from 'fastify';
import { apiKeyPreHandler } from './auth';
import { ApiKeyModel } from '../db/schemas/models/ApiKey';

describe('apiKeyPreHandler', () => {
  it('rejects without key', async () => {
    const app = Fastify();

    app.get('/t', { preHandler: apiKeyPreHandler }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t' });

    expect(res.statusCode).toBe(401);
  });
  it('rejects invalid key', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => null } as any);
    const app = Fastify();

    app.get('/t', { preHandler: apiKeyPreHandler }, async () => ({ ok: true }));
    const res = await app.inject({
      method: 'GET',
      url: '/t',
      headers: { 'x-api-key': 'bad' },
    });

    expect(res.statusCode).toBe(403);
  });
})


