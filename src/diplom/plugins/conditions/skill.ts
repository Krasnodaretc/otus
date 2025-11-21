import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const skillCondition: ConditionPlugin = {
  name: 'skill',
  match: (ctx, params) => {
    const hasAny = readStringArray(params, 'hasAny');

    if (!ctx.skills || ctx.skills.length === 0) return false;

    const set = new Set(ctx.skills.map(s => s.toLowerCase()));

    return hasAny.some(s => set.has(s.toLowerCase()));
  },
};


