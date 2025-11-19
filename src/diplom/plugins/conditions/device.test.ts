import { deviceCondition } from './device';

describe('device condition', () => {
  it('matches device type', () => {
    const res = deviceCondition.match({ device: 'mobile' } as any, { in: ['desktop', 'mobile'] });
    expect(res).toBe(true);
  });
});


