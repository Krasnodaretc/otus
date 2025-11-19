import { JsonDslParser } from './Parser';
import { RuleEvaluator } from './Evaluator';
import { registerDynamicPlugin } from '../../plugins/loader';

describe('Condition OOP evaluation', () => {
  beforeAll(() => {
    registerDynamicPlugin({ kind: 'condition', plugin: { name: 'trueCond', match: () => true } as any });
    registerDynamicPlugin({ kind: 'condition', plugin: { name: 'falseCond', match: () => false } as any });
    registerDynamicPlugin({ kind: 'action', plugin: { name: 'redir', execute: () => ({ type: 'redirect', url: 'x' }) } as any });
  });
  it('all requires all true', async () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({
      rules: [{ id: 'r', if: { all: [{ type: 'trueCond' }, { type: 'falseCond' }] }, then: [{ type: 'redir' }] }],
    } as any);
    const ev = new RuleEvaluator();
    const res = await ev.evaluate({} as any, model);
    expect(res.matchedRuleId).toBeUndefined();
  });
  it('any passes when any true', async () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({
      rules: [{ id: 'r', if: { any: [{ type: 'falseCond' }, { type: 'trueCond' }] }, then: [{ type: 'redir' }] }],
    } as any);
    const ev = new RuleEvaluator();
    const res = await ev.evaluate({} as any, model);
    expect(res.matchedRuleId).toBe('r');
  });
});


