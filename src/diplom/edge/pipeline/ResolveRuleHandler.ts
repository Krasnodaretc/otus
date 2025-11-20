import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';
import { resolveRedirect } from '../service';
import { withMeasurement } from '../../common/observability';

export class ResolveRuleHandler extends BaseHandler {
  protected async process(ctx: RequestContext, res: ResponseResult) {
    const measured = withMeasurement(resolveRedirect, 'edge.resolve_redirect');
    const out = await measured(String(ctx.slug || ''), ctx);
    res.status = out.status;
    res.location = out.location;
    res.matchedRuleId = out.matchedRuleId;
  }
}


