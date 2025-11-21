import { RedirectFacade } from './RedirectFacade';

describe('RedirectFacade', () => {
  it('uses provided root handler result', async () => {
    const mockRoot = {
      handle: jest.fn(async (_ctx: any, res: any) => {
        res.status = 302;
        res.location = 'https://ok';
      }),
    } as any;
    const f = new RedirectFacade(mockRoot);
    const res = await f.handle({ slug: 's1' } as any);
    expect(res.status).toBe(302);
    expect(res.location).toBe('https://ok');
    expect(mockRoot.handle).toHaveBeenCalled();
  });
  it('can work with any handler implementation', async () => {
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

