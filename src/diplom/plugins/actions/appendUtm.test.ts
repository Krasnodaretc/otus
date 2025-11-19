import { appendUtmAction } from './appendUtm';

describe('appendUtm action', () => {
  it('appends query params', async () => {
    const res = await appendUtmAction.execute({} as any, {
      url: 'https://example.com/path',
      map: { utm_campaign: 'x', utm_source: 'y' },
    });
    expect(res.url).toContain('utm_campaign=x');
    expect(res.url).toContain('utm_source=y');
  });
});


