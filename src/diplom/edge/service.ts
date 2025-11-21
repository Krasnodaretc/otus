import { EvaluationContext } from '../common/types';
import { evaluateRuleSet } from '../rules-engine/evaluator';
import { RuleSetModel, SmartLinkModel } from '../db/schemas';
import { registerBuiltInPlugins } from '../plugins/register';

export type RedirectResult = {
  status: number;
  location?: string;
  matchedRuleId?: string;
  explain?: unknown;
};

export interface RedirectResolver {
  resolve(slug: string, ctx: EvaluationContext): Promise<RedirectResult>;
}

export class MongoRedirectResolver implements RedirectResolver {
  private pluginsRegistered = false;

  private ensurePlugins() {
    if (this.pluginsRegistered) return;
    registerBuiltInPlugins();
    this.pluginsRegistered = true;
  }

  async resolve(slug: string, ctx: EvaluationContext): Promise<RedirectResult> {
    this.ensurePlugins();
    const link = await SmartLinkModel.findOne({ slug, enabled: true }).lean();
    if (!link) return { status: 404 };

    const rs = await RuleSetModel.findById(link.ruleSetId).lean();
    if (!rs) return { status: 404 };

    const res = await evaluateRuleSet(ctx, rs.dsl);
    const first = res.actions.find(
      a => a.type === 'redirect' || a.type === 'deeplink' || a.type === 'transformUrl',
    );

    if (!first || !first.url) return { status: 204 };

    return { status: 302, location: first.url, matchedRuleId: res.matchedRuleId, explain: res.explain };
  }
}

