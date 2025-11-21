import { sourceCondition } from './source';

describe('source condition', () => {
  it('matches source', () => {
    const res = sourceCondition.match({ source: 'ads' } as any, { in: ['ads', 'seo'] });

    expect(res).toBe(true);
  });
  it('returns false when context missing or not in list', () => {
    expect(sourceCondition.match({} as any, { in: ['seo'] })).toBe(false);
    expect(sourceCondition.match({ source: 'email' } as any, { in: ['ads'] })).toBe(false);
  });
});


