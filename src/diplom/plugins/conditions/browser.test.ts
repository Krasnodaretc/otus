import { browserCondition } from './browser';

describe('browser condition', () => {
  it('matches browser', () => {
    const res = browserCondition.match({ browser: 'Chrome' } as any, { in: ['chrome', 'firefox'] });
    expect(res).toBe(true);
  });
});


