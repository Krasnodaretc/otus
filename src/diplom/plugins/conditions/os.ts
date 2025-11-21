import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const osCondition: ConditionPlugin = {
  name: 'os',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');

    if (!ctx.os) return false;

    const val = ctx.os.toLowerCase();

    return list.map(x => x.toLowerCase()).includes(val);
  },
};


