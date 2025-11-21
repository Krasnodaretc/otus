import { FastifyReply, FastifyRequest } from 'fastify';
import { IApiKeyReader } from './ports/IApiKeyReader';

export const createApiKeyPreHandler = (reader: IApiKeyReader) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const keyHeader = req.headers['x-api-key'] || req.headers['X-API-Key'];
    const key = typeof keyHeader === 'string' ? keyHeader : Array.isArray(keyHeader) ? keyHeader[0] : '';

    if (!key) return reply.code(401).send({ error: 'api key required' });

    const rec = await reader.findActiveByKey(key);

    if (!rec) return reply.code(403).send({ error: 'forbidden' });
  };
};


