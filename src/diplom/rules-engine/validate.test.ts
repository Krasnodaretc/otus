import { registerBuiltInPlugins } from '../plugins/register';
import { validateRuleSet } from './validate';

describe('rules validate', () => {
  it('reports unknown condition', () => {
    registerBuiltInPlugins();
    const errors = validateRuleSet({
      rules: [{ if: { all: [{ type: 'unknown_cond' }] }, then: [] }],
    } as any);

    expect(errors.some(e => e.includes('Unknown condition'))).toBe(true);
  });
  it('reports unknown action in then and else', () => {
    registerBuiltInPlugins();
    const errors = validateRuleSet({
      rules: [{ if: { any: [{ type: 'skill', hasAny: ['x'] }] }, then: [{ type: 'unknown_act' }], else: [{ type: 'unknown_act2' }] }],
    } as any);

    expect(errors.filter(e => e.includes('Unknown action')).length).toBeGreaterThanOrEqual(2);
  });
  it('passes with known condition/action', () => {
    registerBuiltInPlugins();
    const errors = validateRuleSet({
      rules: [{ if: { any: [{ type: 'skill', hasAny: ['x'] }] }, then: [{ type: 'redirect', url: 'https://e' }] }],
    } as any);

    expect(errors.length).toBe(0);
  });
});


