import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const deviceCondition: ConditionPlugin = {
  name: 'device',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');

    if (!ctx.device) return false;

    const val = ctx.device.toLowerCase();

    return list.map(x => String(x).toLowerCase()).includes(val);
  },
};


