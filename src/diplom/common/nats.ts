import { connect, NatsConnection } from 'nats';
import { readEnv } from './config';

let connection: NatsConnection | null = null;

export const getNats = async () => {
  if (connection) return connection;
  const env = readEnv();
  connection = await connect({ servers: env.natsUrl });
  return connection;
};


