import { ActionPlugin, ConditionPlugin } from './types';

const conditions = new Map<string, ConditionPlugin>();
const actions = new Map<string, ActionPlugin>();

export const registerCondition = (plugin: ConditionPlugin) => {
  conditions.set(plugin.name, plugin);
};

export const registerAction = (plugin: ActionPlugin) => {
  actions.set(plugin.name, plugin);
};

export const getCondition = (name: string) => conditions.get(name);
export const getAction = (name: string) => actions.get(name);

export const listConditions = () => Array.from(conditions.keys());
export const listActions = () => Array.from(actions.keys());


