import { osCondition } from './os';

describe('os condition', () => {
  it('matches os', () => {
    const res = osCondition.match({ os: 'Android' } as any, { in: ['android', 'ios'] });
    expect(res).toBe(true);
  });
});


