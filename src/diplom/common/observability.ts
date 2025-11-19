type Hr = [number, number];
const diffMs = (start: Hr, end: Hr) => {
  const sec = end[0] - start[0];
  const ns = end[1] - start[1];
  return sec * 1000 + ns / 1e6;
};

export interface MetricsSink {
  record: (metric: string, value: number, tags?: Record<string, string>) => void;
}

export class ConsoleMetrics implements MetricsSink {
  record(metric: string, value: number, tags?: Record<string, string>) {
    const line = { metric, value, tags };
    console.log('[metrics]', JSON.stringify(line));
  }
}

export function withMeasurement<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R> | R,
  metric: string,
  sink: MetricsSink = new ConsoleMetrics(),
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    const start = process.hrtime();
    try {
      const res = await fn(...args);
      const end = process.hrtime();
      sink.record(metric, diffMs(start, end));
      return res;
    } catch (e) {
      const end = process.hrtime();
      sink.record(metric, diffMs(start, end), { error: 'true' });
      throw e;
    }
  };
}


