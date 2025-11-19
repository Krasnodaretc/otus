import { EvaluationContext } from '../common/types';
import { evaluateRuleSet } from '../rules-engine/evaluator';
import { RuleSetModel, SmartLinkModel } from '../db/schemas';
import { logger } from '../common/logger';
import { registerBuiltInPlugins } from '../plugins/register';

registerBuiltInPlugins();

export const resolveRedirect = async (slug: string, ctx: EvaluationContext) => {
  const link = await SmartLinkModel.findOne({ slug, enabled: true }).lean();
  if (!link) return { status: 404 };
  const rs = await RuleSetModel.findById(link.ruleSetId).lean();
  if (!rs) return { status: 404 };
  const res = await evaluateRuleSet(ctx, rs.dsl);
  const first = res.actions.find(a => a.type === 'redirect' || a.type === 'deeplink' || a.type === 'transformUrl');
  if (!first || !first.url) return { status: 204 };
  return { status: 302, location: first.url, matchedRuleId: res.matchedRuleId, explain: res.explain };
};


