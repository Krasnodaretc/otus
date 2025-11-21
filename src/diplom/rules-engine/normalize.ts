import { ConditionNode } from './types';

export const toConditionNode = (input: any): ConditionNode => {
  if (!input) return { type: 'all', conditions: [] };

  if (input.all) {
    const conditions = Array.isArray(input.all) ? input.all.map(toConditionNode) : [];

    return { type: 'all', conditions };
  }

  if (input.any) {
    const conditions = Array.isArray(input.any) ? input.any.map(toConditionNode) : [];

    return { type: 'any', conditions };
  }

  if (typeof input.type === 'string') return input as ConditionNode;

  throw new Error('Invalid condition node');
};


