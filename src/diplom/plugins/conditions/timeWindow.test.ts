import { timeWindowCondition } from './timeWindow';

describe('timeWindow condition', () => {
  it('accepts when now within window', () => {
    const now = new Date();
    const hh = now.getUTCHours().toString().padStart(2, '0');
    const mm = now.getUTCMinutes().toString().padStart(2, '0');
    const params = { from: `${hh}:${mm}+00:00`, to: `${hh}:${mm}+00:00` };
    const res = timeWindowCondition.match({} as any, params);
    expect(res).toBe(true);
  });
});


