import { ConditionPlugin } from '../../rules-engine/types';

export const referrerCondition: ConditionPlugin = {
  name: 'referrer',
  match: (ctx, params) => {
    const contains = typeof (params as { contains?: unknown }).contains === 'string'
      ? ((params as { contains?: string }).contains || '').toLowerCase()
      : '';
    const ref = String(ctx.referrer || '').toLowerCase();
    if (!contains) return false;
    return ref.includes(contains);
  },
};


