import Fastify from 'fastify';
import { requireScopes, ApiKeyPolicy } from './policy';
import { ApiKeyModel } from '../db/schemas/models/ApiKey';

describe('ApiKeyPolicy', () => {
  it('all mode requires all scopes', () => {
    const p = new ApiKeyPolicy('all');
    expect(p.isAllowed(['a', 'b'], ['a'])).toBe(true);
    expect(p.isAllowed(['a'], ['a', 'b'])).toBe(false);
  });
  it('any mode requires at least one scope', () => {
    const p = new ApiKeyPolicy('any');
    expect(p.isAllowed(['a'], ['b', 'a'])).toBe(true);
    expect(p.isAllowed([], ['a'])).toBe(false);
  });
});

describe('requireScopes preHandler', () => {
  it('rejects when scope is missing', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => ({ key: 'k', scopes: ['read'] }) } as any);
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['write']) }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': 'k' } });
    expect(res.statusCode).toBe(403);
  });
});


