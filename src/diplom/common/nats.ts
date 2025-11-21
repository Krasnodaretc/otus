import { connect, NatsConnection } from 'nats';
import { readEnv } from './config';
import { logger } from './logger';

let connection: NatsConnection | null = null;

export const getNats = async () => {
  if (connection) return connection;

  const env = readEnv();
  const maxAttempts = 10;
  let attempt = 0;
  let lastError: unknown;

  while (attempt < maxAttempts) {
    try {
      connection = await connect({
        servers: env.natsUrl,
        maxReconnectAttempts: -1,
        reconnectTimeWait: 2000,
        timeout: 2000,
        name: 'diplom-service',
      } as any);
      connection.closed().then((err) => {
        if (err) logger.warn('nats connection closed with error', { error: err.message });
        else logger.info('nats connection closed');
      });

      return connection;
    } catch (e) {
      lastError = e;
      attempt += 1;
      const wait = Math.min(2000 * attempt, 10000);

      logger.warn('nats connect retry', { attempt, waitMs: wait, error: (e as Error)?.message });
      await new Promise(r => setTimeout(r, wait));
    }
  }

  throw lastError;
};


