import Fastify from 'fastify';
import { createApiKeyPreHandler } from './authApiKey';
import { IApiKeyReader } from './ports/IApiKeyReader';

describe('authApiKey preHandler', () => {
  it('allows active key', async () => {
    const reader: IApiKeyReader = { findActiveByKey: async () => ({ key: 'k', active: true }) };
    const pre = createApiKeyPreHandler(reader);
    const app = Fastify();
    app.get('/t', { preHandler: pre }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': 'k' } });
    expect(res.statusCode).toBe(200);
  });
  it('rejects missing key', async () => {
    const reader: IApiKeyReader = { findActiveByKey: async () => null };
    const pre = createApiKeyPreHandler(reader);
    const app = Fastify();
    app.get('/t', { preHandler: pre }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t' });
    expect(res.statusCode).toBe(401);
  });
  it('rejects when reader returns null', async () => {
    const reader: IApiKeyReader = { findActiveByKey: async () => null };
    const pre = createApiKeyPreHandler(reader);
    const app = Fastify();
    app.get('/t', { preHandler: pre }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': 'bad' } });
    expect(res.statusCode).toBe(403);
  });
  it('accepts when header is array', async () => {
    const reader: IApiKeyReader = { findActiveByKey: async () => ({ key: 'k', active: true }) };
    const pre = createApiKeyPreHandler(reader);
    const app = Fastify();
    app.get('/t', { preHandler: pre }, async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/t', headers: { 'x-api-key': ['k'] as any } });
    expect(res.statusCode).toBe(200);
  });
});


