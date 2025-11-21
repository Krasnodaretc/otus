import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';
import { EventBus } from '../../common/events';

export class AuditHandler extends BaseHandler {
  private readonly bus: EventBus;
  constructor(bus: EventBus) {
    super();
    this.bus = bus;
  }

  protected async process(ctx: RequestContext, res: ResponseResult) {
    await this.bus.publish({ type: 'click', slug: ctx.slug as string });

    if (res.matchedRuleId) {
      await this.bus.publish({ type: 'rule_matched', slug: ctx.slug as string, payload: { ruleId: res.matchedRuleId } });
    }

    if (res.location) {
      await this.bus.publish({ type: 'redirect', slug: ctx.slug as string, payload: { location: res.location } });
    }
  }
}


