export type Env = {
  mongoUrl: string;
  redisUrl: string;
  natsUrl: string;
  port?: number;
  nodeEnv?: string;
};

export const readEnv = (): Env => {
  return {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/hr_links',
    redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
    natsUrl: process.env.NATS_URL || 'nats://nats:4222',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
};


