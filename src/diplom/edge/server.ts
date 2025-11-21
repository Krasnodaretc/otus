import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { redirectFacadeFactory } from './redirectFacadeFactory';

const errorStatusCodes = [404, 429, 204];

const bootstrap = async () => {
  const env = readEnv();
  await connectMongo(env.mongoUrl);

  const app = Fastify({ logger: false, trustProxy: true });
  const facade = await redirectFacadeFactory();

  app.get<{ Params: { slug: string } }>('/r/:slug', async (req, reply) => {
    const slug = req.params.slug;
    const ctx = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'],
      locale: req.headers['accept-language'],
      slug,
      time: new Date(),
    };
    const res = await facade.handle(ctx);

    if (errorStatusCodes.includes(res.status)) {
      return reply.code(res.status).send();
    }

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


