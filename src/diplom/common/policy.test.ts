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
  it('accepts with any mode when at least one scope present', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => ({ key: 'k', scopes: ['read'] }) } as any);
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['read','write'], 'any') }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': 'k' } });
    expect(res.statusCode).toBe(200);
  });
  it('accepts uppercase header X-API-Key', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => ({ key: 'k', scopes: ['read'] }) } as any);
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['read'], 'any') }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'X-API-Key': 'k' } as any });
    expect(res.statusCode).toBe(200);
  });
  it('rejects when api key header missing', async () => {
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['read']) }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t' });
    expect(res.statusCode).toBe(401);
  });
  it('rejects when key not found', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => null } as any);
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['read']) }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': 'no' } });
    expect(res.statusCode).toBe(403);
  });
  it('accepts when scopes satisfied (all) and header is array', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => ({ key: 'k', scopes: ['read', 'write'], active: true }) } as any);
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['read','write'], 'all') }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': ['k'] as any } });
    expect(res.statusCode).toBe(200);
  });
  it('accepts when scopes satisfied (any) and bad type in db handled', async () => {
    jest.spyOn(ApiKeyModel, 'findOne').mockReturnValue({ lean: () => ({ key: 'k', scopes: 'read' }) } as any);
    const app = Fastify();
    app.get('/t', { preHandler: requireScopes(['read'], 'any') }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': 'k' } });
    // scopes is string -> treated as [], so not satisfied in 'any' → 403
    expect(res.statusCode).toBe(403);
  });
});


