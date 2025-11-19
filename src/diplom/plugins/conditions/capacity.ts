import { ConditionPlugin } from '../../rules-engine/types';
import { readNumber } from '../utils';

export const capacityCondition: ConditionPlugin = {
  name: 'capacity',
  match: (_ctx, params) => {
    const current = readNumber(params, 'current') ?? 0;
    const max = readNumber(params, 'max') ?? 0;
    if (Number.isNaN(current) || Number.isNaN(max)) return false;
    return current < max;
  },
};


