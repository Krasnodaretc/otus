import { RuleSetRepositoryMongo } from './infrastructure/RuleSetRepositoryMongo';
import { CreateRuleSetHandler, DeleteRuleSetHandler, GetRuleSetHandler, ListRuleSetsHandler, PreviewRulesHandler, UpdateRuleSetHandler } from './application/UseCases';
import { RuleSetRecord } from './domain/IRuleSetRepository';

export const createRuleSet = async (payload: Partial<RuleSetRecord>) => {
  const repo = new RuleSetRepositoryMongo();
  const uc = new CreateRuleSetHandler(repo);
  return uc.execute(payload);
};

export const getRuleSet = async (id: string) => {
  const repo = new RuleSetRepositoryMongo();
  const uc = new GetRuleSetHandler(repo);
  return uc.execute(id);
};

export const listRuleSets = async (query: Partial<RuleSetRecord> = {}) => {
  const repo = new RuleSetRepositoryMongo();
  const uc = new ListRuleSetsHandler(repo);
  return uc.execute(query);
};

export const updateRuleSet = async (id: string, patch: Partial<RuleSetRecord>) => {
  const repo = new RuleSetRepositoryMongo();
  const uc = new UpdateRuleSetHandler(repo);
  return uc.execute(id, patch);
};

export const deleteRuleSet = async (id: string) => {
  const repo = new RuleSetRepositoryMongo();
  const uc = new DeleteRuleSetHandler(repo);
  await uc.execute(id);
  return { deleted: true };
};


