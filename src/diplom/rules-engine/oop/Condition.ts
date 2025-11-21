import { EvaluationContext } from '../../common/types';
import { ExplainEntry } from '../types';
import { getCondition } from '../registry';

export interface ExplainRecorder {
  record: (entry: ExplainEntry) => void;
}

export abstract class Condition {
  abstract evaluate(ctx: EvaluationContext, explain: ExplainRecorder): Promise<boolean> | boolean;
}

export class AllCondition extends Condition {
  private readonly children: Condition[];
  constructor(children: Condition[]) {
    super();
    this.children = children;
  }

  async evaluate(ctx: EvaluationContext, explain: ExplainRecorder): Promise<boolean> {
    for (const child of this.children) {
      const ok = await child.evaluate(ctx, explain);

      if (!ok) return false;
    }

    return true;
  }
}

export class AnyCondition extends Condition {
  private readonly children: Condition[];
  constructor(children: Condition[]) {
    super();
    this.children = children;
  }

  async evaluate(ctx: EvaluationContext, explain: ExplainRecorder): Promise<boolean> {
    for (const child of this.children) {
      const ok = await child.evaluate(ctx, explain);

      if (ok) return true;
    }

    return false;
  }
}

export class PluginCondition extends Condition {
  private readonly name: string;
  private readonly params: Record<string, unknown>;
  constructor(name: string, params: Record<string, unknown>) {
    super();
    this.name = name;
    this.params = params;
  }

  async evaluate(ctx: EvaluationContext, explain: ExplainRecorder): Promise<boolean> {
    const plugin = getCondition(this.name);

    if (!plugin) {
      explain.record({ condition: this.name, result: false });

      return false;
    }

    const res = await plugin.match(ctx, this.params);

    explain.record({ condition: this.name, result: !!res });

    return !!res;
  }
}


