import { ConsoleMetrics, withMeasurement } from './observability';

describe('observability extra cases', () => {
  it('records with custom tags object shape', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const sink = new ConsoleMetrics();

    sink.record('m', 1, { a: 'b' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('default sink also records on sync function', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const fn = withMeasurement(() => 2, 'sync.metric');
    const out = await fn();

    expect(out).toBe(2);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});


