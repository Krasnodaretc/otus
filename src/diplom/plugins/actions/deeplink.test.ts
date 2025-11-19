import { deeplinkAction } from './deeplink';

describe('deeplink action', () => {
  it('returns deeplink', async () => {
    const res = await deeplinkAction.execute({} as any, { url: 'app://open' });
    expect(res.type).toBe('deeplink');
    expect(res.url).toBe('app://open');
  });
});


