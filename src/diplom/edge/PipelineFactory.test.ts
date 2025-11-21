import { PipelineFactory } from './PipelineFactory';
import { RedirectResolver, RedirectResult } from './service';

describe('PipelineFactory', () => {
  it('builds pipeline', async () => {
    const bus = { publish: async () => {} };
    const resolver: RedirectResolver = {
      resolve: async () => ({ status: 302, location: 'https://ok', matchedRuleId: 'r' } as RedirectResult),
    };
    const factory = new PipelineFactory(bus as any, resolver);
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
    const resolverFactory = () =>
      ({
        resolve: async () => ({ status: 302, location: 'https://ok', matchedRuleId: 'r' }),
      } as RedirectResolver);
    const f = await PF.createWithNatsFallback(resolverFactory);
    const root = f.build();
    expect(root).toBeDefined();
  });
});


