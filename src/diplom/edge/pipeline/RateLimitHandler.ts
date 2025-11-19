import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';
import { getRedis } from '../../common/redis';

export class RateLimitHandler extends BaseHandler {
  private readonly limitPerMin: number;
  constructor(limitPerMin = 200) {
    super();
    this.limitPerMin = limitPerMin;
  }
  protected async process(ctx: RequestContext, res: ResponseResult) {
    const redis = getRedis();
    const ip = ctx.ip || 'unknown';
    const window = Math.floor(Date.now() / 60000);
    const key = `rate:${ip}:${window}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    if (count > this.limitPerMin) {
      res.status = 429;
    }
  }
}


