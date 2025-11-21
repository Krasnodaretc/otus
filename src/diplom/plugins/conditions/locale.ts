import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const localeCondition: ConditionPlugin = {
  name: 'locale',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');

    if (!ctx.locale) return false;

    const loc = ctx.locale.toLowerCase();

    return list.map(x => x.toLowerCase()).includes(loc);
  },
};


