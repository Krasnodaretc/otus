import { browserCondition } from './browser';

describe('browser condition', () => {
  it('matches browser', () => {
    const res = browserCondition.match({ browser: 'Chrome' } as any, { in: ['chrome', 'firefox'] });

    expect(res).toBe(true);
  });
  it('returns false when context missing or not in list', () => {
    expect(browserCondition.match({} as any, { in: ['safari'] })).toBe(false);
    expect(browserCondition.match({ browser: 'Edge' } as any, { in: ['chrome'] })).toBe(false);
  });
});


