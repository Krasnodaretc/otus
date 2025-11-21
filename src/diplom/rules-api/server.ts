import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { registerBuiltInPlugins } from '../plugins/register';
import { validateRuleSet } from '../rules-engine/validate';
import { RuleSetNode } from '../rules-engine/types';
import { createApiKeyPreHandler } from '../common/authApiKey';
import { ApiKeyReaderMongo } from '../common/adapters/ApiKeyReaderMongo';
import cors from '@fastify/cors';
import { RuleSetRepositoryMongo } from './infrastructure/RuleSetRepositoryMongo';
import {
  CreateRuleSetHandler,
  DeleteRuleSetHandler,
  GetRuleSetHandler,
  ListRuleSetsHandler,
  PreviewRulesHandler,
  UpdateRuleSetHandler,
} from './application/UseCases';

const bootstrap = async () => {
  const env = readEnv();

  await connectMongo(env.mongoUrl);
  registerBuiltInPlugins();

  const app = Fastify({ logger: false });
  const apiKeyPreHandler = createApiKeyPreHandler(new ApiKeyReaderMongo());

  await app.register(cors, { origin: true });

  const repo = new RuleSetRepositoryMongo();
  const createUc = new CreateRuleSetHandler(repo);
  const getUc = new GetRuleSetHandler(repo);
  const listUc = new ListRuleSetsHandler(repo);
  const updateUc = new UpdateRuleSetHandler(repo);
  const deleteUc = new DeleteRuleSetHandler(repo);
  const previewUc = new PreviewRulesHandler();

  app.get('/rulesets', { preHandler: apiKeyPreHandler }, async () => listUc.execute());
  app.post<{ Body: { name?: string; tenantId?: string; dsl: RuleSetNode; version?: number } }>(
    '/rulesets',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const body = req.body;

      if (!body?.dsl) return reply.code(400).send({ error: 'dsl required' });

      const errors = validateRuleSet(body.dsl);

      if (errors.length) return reply.code(400).send({ errors });

      const created = await createUc.execute(body);

      reply.code(201).send(created);
    },
  );
  app.get<{ Params: { id: string } }>('/rulesets/:id', { preHandler: apiKeyPreHandler }, async (req, reply) => {
    const id = req.params.id;
    const rs = await getUc.execute(id);

    if (!rs) return reply.code(404).send();

    return rs;
  });
  app.patch<{ Params: { id: string }; Body: Partial<{ name: string; tenantId: string; dsl: RuleSetNode; version: number }> }>(
    '/rulesets/:id',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const id = req.params.id;
      const body = req.body;

      if (body && 'dsl' in body && body.dsl) {
        const errors = validateRuleSet(body.dsl);

        if (errors.length) return reply.code(400).send({ errors });
      }

      const rs = await updateUc.execute(id, body);

      if (!rs) return reply.code(404).send();

      return rs;
    },
  );
  app.delete<{ Params: { id: string } }>('/rulesets/:id', { preHandler: apiKeyPreHandler }, async (req, reply) => {
    const id = req.params.id;

    await deleteUc.execute(id);
    reply.code(204).send();
  });
  app.post<{ Body: { context?: unknown; dsl: RuleSetNode } }>(
    '/rules/preview',
    { preHandler: apiKeyPreHandler },
    async (req, reply) => {
      const body = req.body;

      if (!body?.dsl) return reply.code(400).send({ error: 'dsl required' });

      const res = await previewUc.execute(body.context ?? {}, body.dsl);

      reply.code(200).send({
        matchedRuleId: res.matchedRuleId,
        explain: res.explain,
        actions: res.actions,
      });
    },
  );

  const port = env.port || 3001;

  await app.listen({ host: '0.0.0.0', port });
};

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});


