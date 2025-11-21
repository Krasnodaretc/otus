import { Condition } from './Condition';
import { Action } from './Action';

export class Rule {
  readonly id?: string;
  readonly priority: number;
  readonly root: Condition;
  readonly actions: Action[];
  readonly elseActions: Action[];
  constructor(args: { id?: string; priority?: number; root: Condition; actions: Action[]; elseActions?: Action[] }) {
    this.id = args.id;
    this.priority = args.priority ?? 0;
    this.root = args.root;
    this.actions = args.actions;
    this.elseActions = args.elseActions ?? [];
  }
}

export class RuleSetOop {
  readonly rules: Rule[];
  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  ordered(): Rule[] {
    return [...this.rules].sort((a, b) => b.priority - a.priority);
  }
}


