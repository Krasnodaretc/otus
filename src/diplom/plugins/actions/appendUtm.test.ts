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
  it('returns empty url when url missing', async () => {
    const res = await appendUtmAction.execute({} as any, { map: { a: '1' } });

    expect(res.url).toBe('');
  });
  it('ignores non-string map values', async () => {
    const res = await appendUtmAction.execute({} as any, { url: 'https://e', map: { a: 1, b: '2' } as any });

    expect(res.url).toContain('b=2');
    expect(res.url).not.toContain('a=');
  });
});


