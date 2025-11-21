import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';
import { RedirectResolver } from '../service';
import { withMeasurement } from '../../common/observability';

export class ResolveRuleHandler extends BaseHandler {
  private readonly resolver: RedirectResolver;

  constructor(resolver: RedirectResolver) {
    super();
    this.resolver = resolver;
  }

  protected async process(ctx: RequestContext, res: ResponseResult) {
    const measured = withMeasurement(
      (slug: string, context: RequestContext) => this.resolver.resolve(slug, context),
      'edge.resolve_redirect',
    );
    const out = await measured(String(ctx.slug || ''), ctx);
    res.status = out.status;
    res.location = out.location;
    res.matchedRuleId = out.matchedRuleId;
  }
}

