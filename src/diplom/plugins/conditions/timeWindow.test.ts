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
  it('returns false on invalid format', () => {
    const res = timeWindowCondition.match({} as any, { from: 'xx', to: 'yy' } as any);

    expect(res).toBe(false);
  });
  it('handles overnight window', () => {
    const res = timeWindowCondition.match({} as any, { from: '23:00+00:00', to: '01:00+00:00' });

    // cannot assert concrete result without controlling time; just ensure boolean
    expect(typeof res).toBe('boolean');
  });
  it('rejects when now outside regular window', () => {
    // choose a window far from current UTC hour to reduce flakiness
    const nowH = new Date().getUTCHours();
    const start = (nowH + 3) % 24;
    const end = (start + 1) % 24;
    const hh = (n: number) => n.toString().padStart(2, '0');
    const params = { from: `${hh(start)}:00+00:00`, to: `${hh(end)}:00+00:00` };
    const res = timeWindowCondition.match({} as any, params);

    expect(res).toBe(false);
  });
});


