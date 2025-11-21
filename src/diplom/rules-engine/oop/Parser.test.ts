import { JsonDslParser } from './Parser';
import { registerDynamicPlugin } from '../../plugins/loader';

describe('JsonDslParser', () => {
  beforeAll(() => {
    registerDynamicPlugin({ kind: 'condition', plugin: { name: 't', match: () => true } as any });
    registerDynamicPlugin({ kind: 'action', plugin: { name: 'a', execute: () => ({ type: 'redirect', url: 'u' }) } as any });
  });

  it('parses ruleset into OOP model', () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({
      rules: [
        { id: 'r1', priority: 1, if: { all: [{ type: 't' }] }, then: [{ type: 'a' }] },
        { id: 'r2', priority: 5, if: { any: [{ type: 't' }] }, then: [{ type: 'a' }] },
      ],
    } as any);
    const ordered = model.ordered();

    expect(ordered[0].id).toBe('r2');
    expect(ordered[1].id).toBe('r1');
    expect(ordered[0].actions.length).toBe(1);
  });
});


