import { evaluateRuleSet } from './evaluator';
import { registerBuiltInPlugins } from '../plugins/register';

registerBuiltInPlugins();

describe('rules-engine evaluator', () => {
  it('matches skill and geo and returns redirect', async () => {
    const ctx = { skills: ['JavaScript', 'Node'], geo: { country: 'RU' } };
    const rs = {
      rules: [
        {
          id: 'r1',
          if: {
            all: [
              { type: 'skill', hasAny: ['javascript'] },
              { type: 'geo', in: ['ru', 'by', 'kz'] },
            ],
          },
          then: [{ type: 'redirect', url: 'https://example.com/fe' }],
        },
      ],
    };
    const res = await evaluateRuleSet(ctx as any, rs as any);
    expect(res.matchedRuleId).toBe('r1');
    expect(res.actions[0].type).toBe('redirect');
    expect(res.actions[0].url).toBe('https://example.com/fe');
  });
});


