import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';

export class ContextNormalizer extends BaseHandler {
  protected async process(ctx: RequestContext, _res: ResponseResult) {
    if (!ctx.time) ctx.time = new Date();

    if (!ctx.device) ctx.device = 'unknown';
  }
}


