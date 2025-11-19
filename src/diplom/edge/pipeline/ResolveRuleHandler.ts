import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';
import { resolveRedirect } from '../service';

export class ResolveRuleHandler extends BaseHandler {
  protected async process(ctx: RequestContext, res: ResponseResult) {
    const out = await resolveRedirect(String(ctx.slug || ''), ctx);
    res.status = out.status;
    res.location = out.location;
    res.matchedRuleId = out.matchedRuleId;
  }
}


