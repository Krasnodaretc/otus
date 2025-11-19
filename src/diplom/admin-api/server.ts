import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { createCampaign, createSmartLink, createVacancy, issueApiKey, listApiKeys, listCampaigns, listSmartLinks, listVacancies } from './service';
import { createApiKeyPreHandler } from '../common/authApiKey';
import { ApiKeyReaderMongo } from '../common/adapters/ApiKeyReaderMongo';
import cors from '@fastify/cors';

const bootstrap = async () => {
  const env = readEnv();
  await connectMongo(env.mongoUrl);
  const app = Fastify({ logger: false });
  const apiKeyPreHandler = createApiKeyPreHandler(new ApiKeyReaderMongo());
  await app.register(cors, { origin: true });

  app.get('/campaigns', { preHandler: apiKeyPreHandler }, async () => listCampaigns());
  app.post<{ Body: { name: string; description?: string; tenantId?: string } }>(
    '/campaigns',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
    const created = await createCampaign(req.body);
    reply.code(201).send(created);
  });

  app.get('/smart-links', { preHandler: apiKeyPreHandler }, async () => listSmartLinks());
  app.post<{ Body: { slug: string; campaignId?: string; ruleSetId?: string; enabled?: boolean; metadata?: Record<string, unknown> } }>(
    '/smart-links',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
    const created = await createSmartLink(req.body);
    reply.code(201).send(created);
  });

  app.get('/vacancies', { preHandler: apiKeyPreHandler }, async () => listVacancies());
  app.post<{ Body: { title: string; url: string; campaignId?: string; location?: string; skills?: string[]; locale?: string; active?: boolean } }>(
    '/vacancies',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
    const created = await createVacancy(req.body);
    reply.code(201).send(created);
  });

  app.get('/api-keys', { preHandler: apiKeyPreHandler }, async () => listApiKeys());
  app.post<{ Body: { key: string; tenantId?: string; scopes?: string[]; active?: boolean } }>(
    '/api-keys',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
    const created = await issueApiKey(req.body);
    reply.code(201).send(created);
  });

  const port = env.port || 3002;
  await app.listen({ host: '0.0.0.0', port });
};

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});


