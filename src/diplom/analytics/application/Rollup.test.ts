import { DailyRollup } from './Rollup';

describe('DailyRollup', () => {
  it('aggregates rows and upserts metrics', async () => {
    const events = {
      aggregateByDate: async () => [
        { slug: 's', type: 'click', count: 2 },
        { slug: 's', type: 'redirect', count: 1 },
        { slug: 's', type: 'rule_matched', count: 1 },
        { slug: 's', type: 'error', count: 1 },
      ],
    };
    const ups: any[] = [];
    const metrics = { upsertDaily: async (rec: any) => ups.push(rec) };
    const r = new DailyRollup(events as any, metrics as any);

    await r.execute('2025-01-01');
    expect(ups.length).toBe(1);
    expect(ups[0].metrics.clicks).toBe(2);
    expect(ups[0].metrics.redirects).toBe(1);
  });
});


