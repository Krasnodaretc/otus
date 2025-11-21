import { withMeasurement } from './observability';

describe('withMeasurement error path', () => {
  it('records metric with error tag and rethrows', async () => {
    const recs: Array<{ metric: string; value: number; tags?: Record<string, string> }> = [];
    const sink = { record: (metric: string, value: number, tags?: Record<string, string>) => recs.push({ metric, value, tags }) };
    const fn = withMeasurement(async () => { throw new Error('boom'); }, 'err.metric', sink);

    await expect(fn()).rejects.toThrow('boom');
    expect(recs.length).toBe(1);
    expect(recs[0].metric).toBe('err.metric');
    expect(recs[0].tags?.error).toBe('true');
  });
});


