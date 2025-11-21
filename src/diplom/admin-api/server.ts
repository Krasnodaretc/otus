import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { createApiKeyPreHandler } from '../common/authApiKey';
import { ApiKeyReaderMongo } from '../common/adapters/ApiKeyReaderMongo';
import cors from '@fastify/cors';
import {
  CampaignRepositoryMongo,
  SmartLinkRepositoryMongo,
  VacancyRepositoryMongo,
  ApiKeyRepositoryMongo,
} from './infrastructure/MongoRepositories';
import {
  CreateCampaignHandler,
  ListCampaignsHandler,
  CreateSmartLinkHandler,
  ListSmartLinksHandler,
  CreateVacancyHandler,
  ListVacanciesHandler,
  IssueApiKeyHandler,
  ListApiKeysHandler,
} from './application/UseCases';

const bootstrap = async () => {
  const env = readEnv();

  await connectMongo(env.mongoUrl);
  const app = Fastify({ logger: false });
  const apiKeyPreHandler = createApiKeyPreHandler(new ApiKeyReaderMongo());

  await app.register(cors, { origin: true });

   const campaignRepo = new CampaignRepositoryMongo();
   const smartLinkRepo = new SmartLinkRepositoryMongo();
   const vacancyRepo = new VacancyRepositoryMongo();
   const apiKeyRepo = new ApiKeyRepositoryMongo();

   const createCampaignUc = new CreateCampaignHandler(campaignRepo);
   const listCampaignsUc = new ListCampaignsHandler(campaignRepo);
   const createSmartLinkUc = new CreateSmartLinkHandler(smartLinkRepo);
   const listSmartLinksUc = new ListSmartLinksHandler(smartLinkRepo);
   const createVacancyUc = new CreateVacancyHandler(vacancyRepo);
   const listVacanciesUc = new ListVacanciesHandler(vacancyRepo);
   const issueApiKeyUc = new IssueApiKeyHandler(apiKeyRepo);
   const listApiKeysUc = new ListApiKeysHandler(apiKeyRepo);

  app.get('/campaigns', { preHandler: apiKeyPreHandler }, async () => listCampaignsUc.execute());
  app.post<{ Body: { name: string; description?: string; tenantId?: string } }>(
    '/campaigns',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const created = await createCampaignUc.execute(req.body);

      reply.code(201).send(created);
    },
  );

  app.get('/smart-links', { preHandler: apiKeyPreHandler }, async () => listSmartLinksUc.execute());
  app.post<{ Body: { slug: string; campaignId?: string; ruleSetId?: string; enabled?: boolean; metadata?: Record<string, unknown> } }>(
    '/smart-links',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const created = await createSmartLinkUc.execute(req.body);

      reply.code(201).send(created);
    },
  );

  app.get('/vacancies', { preHandler: apiKeyPreHandler }, async () => listVacanciesUc.execute());
  app.post<{ Body: { title: string; url: string; campaignId?: string; location?: string; skills?: string[]; locale?: string; active?: boolean } }>(
    '/vacancies',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const created = await createVacancyUc.execute(req.body);

      reply.code(201).send(created);
    },
  );

  app.get('/api-keys', { preHandler: apiKeyPreHandler }, async () => listApiKeysUc.execute());
  app.post<{ Body: { key: string; tenantId?: string; scopes?: string[]; active?: boolean } }>(
    '/api-keys',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const created = await issueApiKeyUc.execute(req.body);

      reply.code(201).send(created);
    },
  );

  const port = env.port || 3002;

  await app.listen({ host: '0.0.0.0', port });
};

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});


