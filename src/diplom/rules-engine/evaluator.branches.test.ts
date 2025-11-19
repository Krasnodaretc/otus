import { evaluateRuleSet } from './evaluator';
import { registerBuiltInPlugins } from '../plugins/register';

registerBuiltInPlugins();

describe('evaluator branches', () => {
  it('handles any with second true', async () => {
    const ctx = { skills: ['java'] };
    const rs = {
      rules: [
        {
          id: 'r1',
          if: { any: [{ type: 'skill', hasAny: ['js'] }, { type: 'skill', hasAny: ['java'] }] },
          then: [{ type: 'redirect', url: 'https://example.com/b' }],
        },
      ],
    };
    const res = await evaluateRuleSet(ctx as any, rs as any);
    expect(res.matchedRuleId).toBe('r1');
  });

  it('returns no match when all false', async () => {
    const rs = {
      rules: [
        {
          id: 'r2',
          if: { all: [{ type: 'skill', hasAny: ['scala'] }] },
          then: [{ type: 'redirect', url: 'https://example.com/x' }],
        },
      ],
    };
    const res = await evaluateRuleSet({ skills: ['go'] } as any, rs as any);
    expect(res.matchedRuleId).toBeUndefined();
    expect(res.actions.length).toBe(0);
  });

  it('skips unknown action plugin', async () => {
    const rs = {
      rules: [
        {
          id: 'r3',
          if: { all: [{ type: 'skill', hasAny: ['ts'] }] },
          then: [{ type: 'unknown_action' }],
        },
      ],
    };
    const res = await evaluateRuleSet({ skills: ['ts'] } as any, rs as any);
    expect(res.matchedRuleId).toBe('r3');
    expect(res.actions.length).toBe(0);
  });

  it('explain contains false when condition plugin missing', async () => {
    const rs = {
      rules: [{ id: 'r4', if: { all: [{ type: 'not_exists' }] }, then: [] }],
    };
    const res = await evaluateRuleSet({} as any, rs as any);
    expect(res.matchedRuleId).toBeUndefined();
    expect(Array.isArray(res.explain)).toBe(true);
  });
});


