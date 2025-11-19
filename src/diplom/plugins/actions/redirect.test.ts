import { redirectAction } from './redirect';

describe('redirect action', () => {
  it('returns redirect result', async () => {
    const res = await redirectAction.execute({} as any, { url: 'https://example.com' });
    expect(res.type).toBe('redirect');
    expect(res.url).toBe('https://example.com');
  });
});


