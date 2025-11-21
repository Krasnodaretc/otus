import { ContextNormalizer } from './ContextNormalizer';
import { RequestContext, ResponseResult } from './types';

describe('ContextNormalizer', () => {
  it('fills missing time and device', async () => {
    const h = new ContextNormalizer();
    const ctx: RequestContext = {} as any;
    const res: ResponseResult = { status: 200 };

    await h.handle(ctx, res);

    expect(ctx.time).toBeInstanceOf(Date);
    expect(ctx.device).toBe('unknown');
  });

  it('keeps existing time and device', async () => {
    const h = new ContextNormalizer();
    const existingTime = new Date('2025-01-01T00:00:00Z');
    const ctx: RequestContext = { time: existingTime, device: 'mobile' } as any;
    const res: ResponseResult = { status: 200 };

    await h.handle(ctx, res);

    expect(ctx.time).toBe(existingTime);
    expect(ctx.device).toBe('mobile');
  });
});


