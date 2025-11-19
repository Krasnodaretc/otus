import { RateLimitHandler } from './RateLimitHandler';
import { RequestContext, ResponseResult } from './types';

const counts = new Map<string, number>();
jest.mock('../../common/redis', () => ({
  getRedis: () => ({
    incr: async (key: string) => {
      const v = (counts.get(key) || 0) + 1;
      counts.set(key, v);
      return v;
    },
    expire: async () => {},
  }),
}));

describe('RateLimitHandler', () => {
  beforeEach(() => {
    counts.clear();
  });
  it('sets 429 when limit exceeded', async () => {
    const h = new RateLimitHandler(1);
    const res: ResponseResult = { status: 200 };
    const ctx: RequestContext = { ip: '1.1.1.1' };
    await h.handle(ctx, res);
    expect(res.status).toBe(200);
    await h.handle(ctx, res);
    expect(res.status).toBe(429);
  });
  it('uses separate bucket for missing ip and respects limit', async () => {
    const h = new RateLimitHandler(1);
    const res: ResponseResult = { status: 200 };
    await h.handle({} as any, res);
    expect(res.status).toBe(200);
    await h.handle({} as any, res);
    expect(res.status).toBe(429);
  });
});


