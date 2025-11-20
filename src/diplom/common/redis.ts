import Redis from 'ioredis';
import { readEnv } from './config';
import { logger } from './logger';

let client: Redis | null = null;

export const getRedis = () => {
  if (client) return client;
  const env = readEnv();
  client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 5,
    enableAutoPipelining: true,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 200, 3000);
      return delay;
    },
    reconnectOnError: () => {
      logger.warn('redis reconnect on error');
      return true;
    },
  } as any);
  client.on('error', (err) => logger.warn('redis error', { error: err.message }));
  client.on('end', () => logger.info('redis connection closed'));
  return client;
};


