import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const sourceCondition: ConditionPlugin = {
  name: 'source',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');

    if (!ctx.source) return false;

    return list.includes(ctx.source);
  },
};


