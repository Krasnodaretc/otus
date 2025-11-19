import { referrerCondition } from './referrer';

describe('referrer condition', () => {
  it('matches substring', () => {
    const res = referrerCondition.match({ referrer: 'https://example.com/a' } as any, { contains: 'example.com' });
    expect(res).toBe(true);
  });
});


