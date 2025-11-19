import { EventBus, createNatsEventBus, eventBus as consoleBus } from '../common/events';
import { getNats } from '../common/nats';
import { ContextNormalizer } from './pipeline/ContextNormalizer';
import { RateLimitHandler } from './pipeline/RateLimitHandler';
import { ResolveRuleHandler } from './pipeline/ResolveRuleHandler';
import { AuditHandler } from './pipeline/AuditHandler';
import { Handler } from './pipeline/Handler';

export class PipelineFactory {
  private readonly bus: EventBus;
  constructor(bus: EventBus) {
    this.bus = bus;
  }
  static async createWithNatsFallback(): Promise<PipelineFactory> {
    const bus = await createNatsEventBus(getNats).catch(() => consoleBus);
    return new PipelineFactory(bus);
  }
  build(): Handler {
    const normalizer = new ContextNormalizer();
    const rate = new RateLimitHandler();
    const resolver = new ResolveRuleHandler();
    const audit = new AuditHandler(this.bus);
    normalizer.setNext(rate).setNext(resolver).setNext(audit);
    return normalizer;
  }
}


