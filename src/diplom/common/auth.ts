import { ApiKeyModel } from '../db/schemas';
import { FastifyReply, FastifyRequest } from 'fastify';

export const apiKeyPreHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const key = (req.headers['x-api-key'] || req.headers['X-API-Key'] || '') as string;
  if (!key) return reply.code(401).send({ error: 'api key required' });
  const rec = await ApiKeyModel.findOne({ key, active: true }).lean();
  if (!rec) return reply.code(403).send({ error: 'forbidden' });
};


