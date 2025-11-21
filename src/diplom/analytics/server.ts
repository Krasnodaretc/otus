import Fastify from 'fastify';
import { readEnv } from '../common/config';
import { connectMongo } from '../db/schemas';
import { getNats } from '../common/nats';
import { createApiKeyPreHandler } from '../common/authApiKey';
import { ApiKeyReaderMongo } from '../common/adapters/ApiKeyReaderMongo';
import { requireScopes } from '../common/policy';
import { logger } from '../common/logger';
import { EventRepositoryMongo, MetricRepositoryMongo } from './infrastructure/MongoRepositories';
import { AnalyticsService } from './service';

const bootstrap = async () => {
  const env = readEnv();

  await connectMongo(env.mongoUrl);
  const app = Fastify({ logger: false });

  const apiKeyPreHandler = createApiKeyPreHandler(new ApiKeyReaderMongo());

  const eventsRepo = new EventRepositoryMongo();
  const metricsRepo = new MetricRepositoryMongo();
  const analytics = new AnalyticsService(eventsRepo, metricsRepo);

  app.post('/rollup/:date', { preHandler: [apiKeyPreHandler, requireScopes(['analytics:rollup'])] }, async (req) => {
    const date = (req.params as any).date as string;

    return analytics.rollupDaily(date);
  });

  const port = env.port || 3003;

  await app.listen({ host: '0.0.0.0', port });

  try {
    const nats = await getNats();
    const sub = nats.subscribe('events.*', { queue: 'analytics' });

    (async () => {
      for await (const m of sub) {
        try {
          const data = JSON.parse(new TextDecoder().decode(m.data));

          await analytics.ingestEvent({
            type: data.type,
            slug: data.slug,
            campaignId: data.campaignId,
            traceId: data.traceId,
            payload: data.payload,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          });
        } catch (e) {
          logger.warn('analytics event ingest failed', { error: (e as Error)?.message });
        }
      }
    })();
  } catch (e) {
    logger.warn('analytics nats subscribe failed', { error: (e as Error)?.message });
  }
};

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});


