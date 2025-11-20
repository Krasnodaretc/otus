import { FastifyReply, FastifyRequest } from 'fastify';
import { IApiKeyReader } from './ports/IApiKeyReader';
import { ApiKeyReaderMongo } from './adapters/ApiKeyReaderMongo';

export type ScopeMode = 'all' | 'any';

export class ApiKeyPolicy {
  private readonly mode: ScopeMode;
  constructor(mode: ScopeMode = 'all') {
    this.mode = mode;
  }
  isAllowed(keyScopes: string[] | undefined, required: string[]): boolean {
    const have = new Set((keyScopes || []).map(s => s.toLowerCase()));
    const need = required.map(s => s.toLowerCase());
    if (this.mode === 'all') return need.every(s => have.has(s));
    return need.some(s => have.has(s));
  }
}

export const requireScopes = (scopes: string[], mode: ScopeMode = 'all', reader: IApiKeyReader = new ApiKeyReaderMongo()) => {
  const policy = new ApiKeyPolicy(mode);
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const key = (req.headers['x-api-key'] || req.headers['X-API-Key'] || '') as string;
    if (!key) return reply.code(401).send({ error: 'api key required' });
    const rec = await reader.findActiveByKey(key);
    if (!rec) return reply.code(403).send({ error: 'forbidden' });
    const scopesArray = Array.isArray(rec.scopes) ? rec.scopes : [];
    if (!policy.isAllowed(scopesArray, scopes)) return reply.code(403).send({ error: 'insufficient_scope' });
  };
};


