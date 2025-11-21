import Fastify from 'fastify';
import { registerBuiltInPlugins } from '../plugins/register';
import { validateRuleSet } from '../rules-engine/validate';
import { evaluateRuleSet } from '../rules-engine/evaluator';

export const createPreviewApp = async () => {
  registerBuiltInPlugins();
  const app = Fastify({ logger: false });

  app.post('/rules/preview', async (req, reply) => {
    const body = req.body as any;

    if (!body?.dsl) return reply.code(400).send({ error: 'dsl required' });

    const errors = validateRuleSet(body.dsl);

    if (errors.length) return reply.code(400).send({ errors });

    const res = await evaluateRuleSet((body.context || {}) as any, body.dsl);

    reply.code(200).send({
      matchedRuleId: res.matchedRuleId,
      explain: res.explain,
      actions: res.actions,
    });
  });

  return app;
};


