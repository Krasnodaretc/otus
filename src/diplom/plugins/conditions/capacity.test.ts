import { capacityCondition } from './capacity';

describe('capacity condition', () => {
  it('true when current < max', () => {
    const res = capacityCondition.match({} as any, { current: 9, max: 10 });
    expect(res).toBe(true);
  });
  it('false when current >= max', () => {
    const res = capacityCondition.match({} as any, { current: 10, max: 10 });
    expect(res).toBe(false);
  });
  it('false when values not numbers', () => {
    const res = capacityCondition.match({} as any, { current: 'x', max: 'y' } as any);
    expect(res).toBe(false);
  });
});


