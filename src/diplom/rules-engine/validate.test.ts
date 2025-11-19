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
});


