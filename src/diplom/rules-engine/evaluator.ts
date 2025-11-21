import { EvaluationResult, RuleSetNode } from './types';
import { EvaluationContext } from '../common/types';
import { JsonDslParser } from './oop/Parser';
import { RuleEvaluator } from './oop/Evaluator';

export const evaluateRuleSet = async (ctx: EvaluationContext, ruleset: RuleSetNode): Promise<EvaluationResult> => {
  const parser = new JsonDslParser();
  const evaluator = new RuleEvaluator();
  const model = parser.parseRuleSet(ruleset);

  return evaluator.evaluate(ctx, model);
};


