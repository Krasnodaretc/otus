import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiKeyModel } from '../db/schemas';

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

export const requireScopes = (scopes: string[], mode: ScopeMode = 'all') => {
  const policy = new ApiKeyPolicy(mode);
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const key = (req.headers['x-api-key'] || req.headers['X-API-Key'] || '') as string;
    if (!key) return reply.code(401).send({ error: 'api key required' });
    const rec = await ApiKeyModel.findOne({ key, active: true }).lean();
    if (!rec) return reply.code(403).send({ error: 'forbidden' });
    const scopesValue = (rec as { scopes?: unknown }).scopes;
    const scopesArray = Array.isArray(scopesValue) ? (scopesValue as string[]) : [];
    if (!policy.isAllowed(scopesArray, scopes)) return reply.code(403).send({ error: 'insufficient_scope' });
  };
};


