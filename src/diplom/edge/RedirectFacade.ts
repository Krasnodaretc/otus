import { RequestContext, ResponseResult } from './pipeline/types';
import { Handler } from './pipeline/Handler';
import { ContextNormalizer } from './pipeline/ContextNormalizer';
import { ResolveRuleHandler } from './pipeline/ResolveRuleHandler';
import { AuditHandler } from './pipeline/AuditHandler';
import { EventBus } from '../common/events';

export class RedirectFacade {
  private readonly root: Handler;
  constructor(root?: Handler) {
    if (root) {
      this.root = root;
    } else {
      const bus: EventBus = { publish: async () => {} };
      const normalizer = new ContextNormalizer();
      const resolver = new ResolveRuleHandler();
      const audit = new AuditHandler(bus);
      normalizer.setNext(resolver).setNext(audit);
      this.root = normalizer;
    }
  }
  async handle(ctx: RequestContext): Promise<ResponseResult> {
    const res: ResponseResult = { status: 200 };
    await this.root.handle(ctx, res);
    return res;
  }
}


