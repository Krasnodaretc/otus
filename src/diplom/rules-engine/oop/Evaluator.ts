import { EvaluationContext } from '../../common/types';
import { EvaluationResult, ExplainEntry } from '../types';
import { RuleSetOop } from './Rule';
import { Condition, ExplainRecorder } from './Condition';

class Recorder implements ExplainRecorder {
  private readonly entries: ExplainEntry[] = [];
  record(entry: ExplainEntry) {
    this.entries.push(entry);
  }
  all(): ExplainEntry[] {
    return this.entries;
  }
}

export class RuleEvaluator {
  async evaluate(ctx: EvaluationContext, ruleset: RuleSetOop): Promise<EvaluationResult> {
    for (const rule of ruleset.ordered()) {
      const rec = new Recorder();
      const matched = await rule.root.evaluate(ctx, rec);
      if (matched) {
        const actions = [];
        for (const a of rule.actions) {
          const r = await a.run(ctx);
          if (r) actions.push(r);
        }
        return { matchedRuleId: rule.id, explain: rec.all(), actions };
      }
    }
    return { explain: [], actions: [] };
  }
}


