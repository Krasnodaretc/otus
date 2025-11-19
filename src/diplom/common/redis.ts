import Redis from 'ioredis';
import { readEnv } from './config';

let client: Redis | null = null;

export const getRedis = () => {
  if (client) return client;
  const env = readEnv();
  client = new Redis(env.redisUrl);
  return client;
};


