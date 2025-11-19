import { withMeasurement, ConsoleMetrics } from './observability';

describe('withMeasurement', () => {
  it('records metric on success', async () => {
    const recs: any[] = [];
    const sink: ConsoleMetrics = { record: (m: string, v: number) => recs.push({ m, v }) } as any;
    const fn = withMeasurement(async () => 42, 'test.metric', sink);
    const val = await fn();
    expect(val).toBe(42);
    expect(recs.length).toBe(1);
    expect(recs[0].m).toBe('test.metric');
  });
});


