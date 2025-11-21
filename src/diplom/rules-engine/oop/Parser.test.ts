import { JsonDslParser } from './Parser';
import { registerDynamicPlugin } from '../../plugins/loader';

describe('JsonDslParser', () => {
  beforeAll(() => {
    registerDynamicPlugin({ kind: 'condition', plugin: { name: 't', match: () => true } as any });
    registerDynamicPlugin({ kind: 'action', plugin: { name: 'a', execute: () => ({ type: 'redirect', url: 'u' }) } as any });
  });

  it('parses ruleset with all/any into OOP model', () => {
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

  it('handles missing condition and actions', () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({
      rules: [
        { id: 'r1', priority: 1, if: undefined, then: undefined, else: undefined } as any,
      ],
    } as any);
    const ordered = model.ordered();

    expect(ordered.length).toBe(1);
    expect(ordered[0].id).toBe('r1');
    expect(ordered[0].actions.length).toBe(0);
  });

  it('parses plugin conditions and actions with params', () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({
      rules: [
        { id: 'r1', priority: 1, if: { type: 't', flag: true }, then: [{ type: 'a', x: 1 }] },
      ],
    } as any);
    const ordered = model.ordered();

    expect(ordered.length).toBe(1);
    expect(ordered[0].id).toBe('r1');
    expect(ordered[0].actions.length).toBe(1);
  });

  it('handles condition node without type', () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({
      rules: [
        { id: 'r1', priority: 1, if: {} as any, then: [] },
      ],
    } as any);
    const ordered = model.ordered();

    expect(ordered.length).toBe(1);
    expect(ordered[0].id).toBe('r1');
  });

  it('handles missing rules array', () => {
    const parser = new JsonDslParser();
    const model = parser.parseRuleSet({} as any);
    const ordered = model.ordered();

    expect(ordered.length).toBe(0);
  });
});


