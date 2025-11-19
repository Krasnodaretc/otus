import { sourceCondition } from './source';

describe('source condition', () => {
  it('matches source', () => {
    const res = sourceCondition.match({ source: 'ads' } as any, { in: ['ads', 'seo'] });
    expect(res).toBe(true);
  });
});


