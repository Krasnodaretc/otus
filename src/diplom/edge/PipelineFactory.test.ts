jest.mock('./service', () => ({
  resolveRedirect: async () => ({ status: 302, location: 'https://ok', matchedRuleId: 'r' }),
}));

import { PipelineFactory } from './PipelineFactory';

describe('PipelineFactory', () => {
  it('builds pipeline', async () => {
    const bus = { publish: async () => {} };
    const factory = new PipelineFactory(bus as any);
    const root = factory.build();
    expect(typeof (root as any).handle).toBe('function');
  });
  it('createWithNatsFallback uses consoleBus on failure', async () => {
    jest.resetModules();
    jest.doMock('../common/events', () => ({
      createNatsEventBus: async () => { throw new Error('no nats'); },
      eventBus: { publish: async () => {} },
    }));
    const { PipelineFactory: PF } = await import('./PipelineFactory');
    const f = await PF.createWithNatsFallback();
    const root = f.build();
    expect(root).toBeDefined();
  });
});


