import { EvaluationContext, ActionExecutionResult } from '../../common/types';
import { getAction } from '../registry';
import { logger } from '../../common/logger';

export abstract class Action {
  abstract run(ctx: EvaluationContext): Promise<ActionExecutionResult | undefined> | ActionExecutionResult | undefined;
}

export class PluginAction extends Action {
  private readonly name: string;
  private readonly params: Record<string, unknown>;
  constructor(name: string, params: Record<string, unknown>) {
    super();
    this.name = name;
    this.params = params;
  }

  async run(ctx: EvaluationContext): Promise<ActionExecutionResult | undefined> {
    const plugin = getAction(this.name);

    if (!plugin) {
      logger.warn('action plugin not found', { action: this.name });

      return undefined;
    }

    return plugin.execute(ctx, this.params);
  }
}


