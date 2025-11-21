import { webhookAction } from './webhook';

describe('webhook action', () => {
  it('returns webhook payload', async () => {
    const res = await webhookAction.execute({} as any, { url: 'https://hook', payload: { a: 1 } });

    expect(res.type).toBe('webhook');
    expect(res.url).toBe('https://hook');
    expect(res.payload).toEqual({ a: 1 });
  });
  it('handles missing url and null payload', async () => {
    const res = await webhookAction.execute({} as any, { payload: null } as any);

    expect(res.url).toBe('');
    expect(res.payload).toBeNull();
  });
  it('handles non-object params', async () => {
    const res = await webhookAction.execute({} as any, 'x' as any);

    expect(res.url).toBe('');
    expect(res.payload).toBeUndefined();
  });
});


