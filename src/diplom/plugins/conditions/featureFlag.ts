import { ConditionPlugin } from '../../rules-engine/types';

export const featureFlagCondition: ConditionPlugin = {
  name: 'featureFlag',
  match: (ctx, params) => {
    const name = typeof (params as { name?: unknown }).name === 'string' ? (params as { name?: string }).name! : '';
    const enabledVal = (params as { enabled?: unknown }).enabled;
    const expected = enabledVal === undefined ? true : Boolean(enabledVal);

    if (!name) return false;

    const flags = ctx.featureFlags || {};

    return Boolean(flags[name]) === expected;
  },
};


