import { ConditionPlugin } from '../../rules-engine/types';
import { readStringArray } from '../utils';

export const geoCondition: ConditionPlugin = {
  name: 'geo',
  match: (ctx, params) => {
    const list = readStringArray(params, 'in');
    if (!ctx.geo || !ctx.geo.country) return false;
    const country = ctx.geo.country.toLowerCase();
    return list.map(x => x.toLowerCase()).includes(country);
  },
};


