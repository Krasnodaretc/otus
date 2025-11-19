import { ActionExecutionResult, EvaluationContext } from '../common/types';

export type ConditionParams = Record<string, unknown>;
export type ActionParams = Record<string, unknown>;

export type ConditionNode =
  | { type: 'all'; conditions: ConditionNode[] }
  | { type: 'any'; conditions: ConditionNode[] }
  | { type: string; [key: string]: unknown };

export type ActionNode = { type: string; [key: string]: unknown };

export type RuleNode = {
  id?: string;
  if: ConditionNode | { all?: unknown[]; any?: unknown[] };
  then: ActionNode[];
  else?: ActionNode[];
  priority?: number;
};

export type RuleSetNode = {
  rules: RuleNode[];
};

export type ExplainEntry = {
  condition: string;
  result: boolean;
};

export type EvaluationResult = {
  matchedRuleId?: string;
  explain: ExplainEntry[];
  actions: ActionExecutionResult[];
};

export interface ConditionPlugin {
  name: string;
  match: (ctx: EvaluationContext, params: ConditionParams) => boolean | Promise<boolean>;
}

export interface ActionPlugin {
  name: string;
  execute: (ctx: EvaluationContext, params: ActionParams) => ActionExecutionResult | Promise<ActionExecutionResult>;
}


