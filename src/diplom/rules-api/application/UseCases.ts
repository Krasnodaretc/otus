import { IRuleSetRepository, RuleSetRecord } from '../domain/IRuleSetRepository';
import { validateRuleSet } from '../../rules-engine/validate';
import { evaluateRuleSet } from '../../rules-engine/evaluator';

export class CreateRuleSetHandler {
  constructor(private readonly repo: IRuleSetRepository) {}
  async execute(payload: Partial<RuleSetRecord>): Promise<RuleSetRecord> {
    if (!payload.dsl) throw new Error('dsl required');

    const errors = validateRuleSet(payload.dsl);

    if (errors.length) throw new Error(errors.join('; '));

    return this.repo.create(payload);
  }
}

export class GetRuleSetHandler {
  constructor(private readonly repo: IRuleSetRepository) {}
  execute(id: string) {
    return this.repo.findById(id);
  }
}

export class ListRuleSetsHandler {
  constructor(private readonly repo: IRuleSetRepository) {}
  execute(query?: Partial<RuleSetRecord>) {
    return this.repo.list(query);
  }
}

export class UpdateRuleSetHandler {
  constructor(private readonly repo: IRuleSetRepository) {}
  async execute(id: string, patch: Partial<RuleSetRecord>) {
    if (patch.dsl) {
      const errors = validateRuleSet(patch.dsl);

      if (errors.length) throw new Error(errors.join('; '));
    }

    return this.repo.update(id, patch);
  }
}

export class DeleteRuleSetHandler {
  constructor(private readonly repo: IRuleSetRepository) {}
  async execute(id: string) {
    await this.repo.delete(id);
  }
}

export class PreviewRulesHandler {
  async execute(context: any, dsl: any) {
    const errors = validateRuleSet(dsl);

    if (errors.length) throw new Error(errors.join('; '));

    return evaluateRuleSet(context, dsl);
  }
}


