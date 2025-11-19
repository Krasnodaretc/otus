import { ResolveRuleHandler } from './ResolveRuleHandler';

jest.mock('../service', () => ({
  resolveRedirect: jest.fn(async (slug: string) => ({ status: slug ? 302 : 204 })),
}));

describe('ResolveRuleHandler branches', () => {
  it('handles with slug present', async () => {
    const h = new ResolveRuleHandler();
    const res: any = { status: 200 };
    await h.handle({ slug: 's' } as any, res);
    expect(res.status).toBe(302);
  });
  it('handles with empty slug', async () => {
    const h = new ResolveRuleHandler();
    const res: any = { status: 200 };
    await h.handle({} as any, res);
    expect(res.status).toBe(204);
  });
});


