import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { RedirectFacade } from './RedirectFacade';
import { PipelineFactory } from './PipelineFactory';

const bootstrap = async () => {
  const env = readEnv();
  await connectMongo(env.mongoUrl);

  const app = Fastify({ logger: false, trustProxy: true });
  const factory = await PipelineFactory.createWithNatsFallback();
  const facade = new RedirectFacade(factory.build());

  app.get<{ Params: { slug: string } }>('/r/:slug', async (req, reply) => {
    const slug = req.params.slug;
    const ctx = {
      ip: req.ip as string | undefined,
      userAgent: req.headers['user-agent'] as string | undefined,
      referrer: req.headers['referer'] as string | undefined,
      locale: req.headers['accept-language'] as string | undefined,
      slug,
      time: new Date(),
    };
    const res = await facade.handle(ctx);
    if (res.status === 404) return reply.code(404).send();
    if (res.status === 429) return reply.code(429).send();
    if (res.status === 204) return reply.code(204).send();
    reply.header('X-Rule-Id', res.matchedRuleId || '');
    return reply.redirect(String(res.location), 302);
  });

  const port = env.port || 3000;
  await app.listen({ host: '0.0.0.0', port });
};

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});


