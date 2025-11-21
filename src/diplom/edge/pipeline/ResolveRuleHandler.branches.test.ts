import { ResolveRuleHandler } from './ResolveRuleHandler';
import { RedirectResolver, RedirectResult } from '../service';

describe('ResolveRuleHandler branches', () => {
  it('handles with slug present', async () => {
    const resolver: RedirectResolver = {
      resolve: jest.fn(async (slug: string) => ({ status: slug ? 302 : 204 } as RedirectResult)),
    };
    const h = new ResolveRuleHandler(resolver);
    const res: any = { status: 200 };
    await h.handle({ slug: 's' } as any, res);
    expect(res.status).toBe(302);
  });
  it('handles with empty slug', async () => {
    const resolver: RedirectResolver = {
      resolve: jest.fn(async (slug: string) => ({ status: slug ? 302 : 204 } as RedirectResult)),
    };
    const h = new ResolveRuleHandler(resolver);
    const res: any = { status: 200 };
    await h.handle({} as any, res);
    expect(res.status).toBe(204);
  });
});

