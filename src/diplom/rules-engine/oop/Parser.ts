import { RuleSetNode, RuleNode, ActionNode } from '../types';
import { AnyCondition, AllCondition, Condition, PluginCondition } from './Condition';
import { Action, PluginAction } from './Action';
import { Rule, RuleSetOop } from './Rule';

const toCondition = (node: Record<string, unknown>): Condition => {
  if (!node) return new AllCondition([]);

  const allValue = (node as { all?: unknown[] }).all;

  if (Array.isArray(allValue)) {
    const children = allValue.map((n) => toCondition(n as Record<string, unknown>));

    return new AllCondition(children);
  }

  const anyValue = (node as { any?: unknown[] }).any;

  if (Array.isArray(anyValue)) {
    const children = anyValue.map((n) => toCondition(n as Record<string, unknown>));

    return new AnyCondition(children);
  }

  const name = 'type' in node ? String((node as { type: unknown }).type) : '';
  const params: Record<string, unknown> = {};

  for (const k in node) {
    if (k !== 'type') {
      params[k] = (node as Record<string, unknown>)[k];
    }
  }

  return new PluginCondition(name, params);
};

const toActions = (nodes: ActionNode[] | undefined): Action[] => {
  return (nodes || []).map(n => {
    const params = { ...n };

    delete (params as { type?: unknown }).type;

    return new PluginAction(String(n.type), params);
  });
};

const toRule = (node: RuleNode): Rule => {
  const root = toCondition(node.if);
  const actions = toActions(node.then);
  const elseActions = toActions(node.else);

  return new Rule({ id: node.id, priority: node.priority, root, actions, elseActions });
};

export class JsonDslParser {
  parseRuleSet(input: RuleSetNode): RuleSetOop {
    const rules = (input.rules || []).map(toRule);

    return new RuleSetOop(rules);
  }
}


