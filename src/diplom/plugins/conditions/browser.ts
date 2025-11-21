import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const browserCondition: ConditionPlugin = {
  name: 'browser',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');

    if (!ctx.browser) return false;

    const val = ctx.browser.toLowerCase();

    return list.map(x => x.toLowerCase()).includes(val);
  },
};


