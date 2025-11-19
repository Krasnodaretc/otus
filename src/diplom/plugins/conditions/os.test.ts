import { osCondition } from './os';

describe('os condition', () => {
  it('matches os', () => {
    const res = osCondition.match({ os: 'Android' } as any, { in: ['android', 'ios'] });
    expect(res).toBe(true);
  });
  it('returns false when context missing or not in list', () => {
    expect(osCondition.match({} as any, { in: ['linux'] })).toBe(false);
    expect(osCondition.match({ os: 'Windows' } as any, { in: ['android'] })).toBe(false);
  });
});


