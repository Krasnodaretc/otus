import { referrerCondition } from './referrer';

describe('referrer condition', () => {
  it('matches substring', () => {
    const res = referrerCondition.match({ referrer: 'https://example.com/a' } as any, { contains: 'example.com' });
    expect(res).toBe(true);
  });
  it('returns false when no referrer provided', () => {
    const res = referrerCondition.match({} as any, { contains: 'example.com' });
    expect(res).toBe(false);
  });
  it('returns false when contains missing or not present in referrer', () => {
    expect(referrerCondition.match({ referrer: 'https://a.com' } as any, { contains: '' })).toBe(false);
    expect(referrerCondition.match({ referrer: 'https://a.com' } as any, { contains: 'example.com' })).toBe(false);
  });
  it('returns false when contains is not string', () => {
    expect(referrerCondition.match({ referrer: 'https://a.com' } as any, { contains: 123 } as any)).toBe(false);
    expect(referrerCondition.match({ referrer: 'https://a.com' } as any, {} as any)).toBe(false);
  });
});


