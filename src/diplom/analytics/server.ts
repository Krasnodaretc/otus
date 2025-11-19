import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { rollupDaily } from './service';
import { getNats } from '../common/nats';
import { EventModel } from '../db/schemas';

const bootstrap = async () => {
  const env = readEnv();
  await connectMongo(env.mongoUrl);
  const app = Fastify({ logger: false });

  app.post('/rollup/:date', async (req) => {
    const date = (req.params as any).date as string;
    return rollupDaily(date);
  });

  const port = env.port || 3003;
  await app.listen({ host: '0.0.0.0', port });

  try {
    const nats = await getNats();
    const sub = nats.subscribe('events.*');
    (async () => {
      for await (const m of sub) {
        try {
          const data = JSON.parse(new TextDecoder().decode(m.data));
          await EventModel.create({
            type: data.type,
            slug: data.slug,
            campaignId: data.campaignId,
            traceId: data.traceId,
            payload: data.payload,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          });
        } catch (e) {}
      }
    })();
  } catch {}
};

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});


