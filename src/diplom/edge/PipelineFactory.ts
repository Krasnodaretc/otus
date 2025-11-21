import { EventBus, createNatsEventBus, eventBus as consoleBus } from '../common/events';
import { getNats } from '../common/nats';
import { ContextNormalizer } from './pipeline/ContextNormalizer';
import { RateLimitHandler } from './pipeline/RateLimitHandler';
import { ResolveRuleHandler } from './pipeline/ResolveRuleHandler';
import { AuditHandler } from './pipeline/AuditHandler';
import { Handler } from './pipeline/Handler';
import { RedirectResolver } from './service';

export class PipelineFactory {
  private readonly bus: EventBus;
  private readonly resolver: RedirectResolver;

  constructor(bus: EventBus, resolver: RedirectResolver) {
    this.bus = bus;
    this.resolver = resolver;
  }

  static async createWithNatsFallback(
    resolver: RedirectResolver,
  ): Promise<PipelineFactory> {
    const bus = await createNatsEventBus(getNats).catch(() => consoleBus);

    return new PipelineFactory(bus, resolver);
  }

  build(): Handler {
    const normalizer = new ContextNormalizer();
    const rate = new RateLimitHandler();
    const resolverHandler = new ResolveRuleHandler(this.resolver);
    const audit = new AuditHandler(this.bus);

    normalizer.setNext(rate).setNext(resolverHandler).setNext(audit);

    return normalizer;
  }
}


