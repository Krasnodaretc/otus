import { AuditHandler } from './AuditHandler';
import { RequestContext, ResponseResult } from './types';

describe('AuditHandler', () => {
  it('publishes events', async () => {
    const published: any[] = [];
    const bus = { publish: async (e: any) => published.push(e) };
    const h = new AuditHandler(bus as any);
    const res: ResponseResult = { status: 200, location: 'https://x', matchedRuleId: 'r1' };
    const ctx: RequestContext = { slug: 's' };
    await h.handle(ctx, res);
    expect(published.length).toBe(3);
  });
});


