import { RedirectFacade } from './RedirectFacade';

jest.mock('./service', () => ({
  resolveRedirect: async () => ({ status: 302, location: 'https://ok' }),
}));

jest.mock('../common/redis', () => ({
  getRedis: () => {
    let c = 0;
    return { incr: async () => ++c, expire: async () => {} };
  },
}));

jest.mock('../common/events', () => ({
  createNatsEventBus: async () => ({ publish: async () => {} }),
  eventBus: { publish: async () => {} },
}));

jest.mock('../common/nats', () => ({
  getNats: async () => ({}),
}));

describe('RedirectFacade pipeline', () => {
  it('returns redirect result', async () => {
    const f = new RedirectFacade();
    const res = await f.handle({ slug: 's1' } as any);
    expect(res.status).toBe(302);
    expect(res.location).toBe('https://ok');
  });
  it('can work with provided root handler', async () => {
    const mockRoot = {
      handle: jest.fn(async (_ctx: any, res: any) => {
        res.status = 204;
      }),
    } as any;
    const f = new RedirectFacade(mockRoot);
    const res = await f.handle({} as any);
    expect(res.status).toBe(204);
    expect(mockRoot.handle).toHaveBeenCalled();
  });
});


