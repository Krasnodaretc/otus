import { RateLimitHandler } from './RateLimitHandler';
import { RequestContext, ResponseResult } from './types';

jest.mock('../../common/redis', () => {
  const store = { c: 0 };
  return {
    getRedis: () => ({
      incr: async () => ++store.c,
      expire: async () => {},
    }),
  };
});

describe('RateLimitHandler', () => {
  it('sets 429 when limit exceeded', async () => {
    const h = new RateLimitHandler(1);
    const res: ResponseResult = { status: 200 };
    const ctx: RequestContext = { ip: '1.1.1.1' };
    await h.handle(ctx, res);
    expect(res.status).toBe(200);
    await h.handle(ctx, res);
    expect(res.status).toBe(429);
  });
});


