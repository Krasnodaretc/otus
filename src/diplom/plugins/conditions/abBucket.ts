import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const abBucketCondition: ConditionPlugin = {
  name: 'abBucket',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');

    if (!ctx.abBucket) return false;

    return list.includes(ctx.abBucket);
  },
};


