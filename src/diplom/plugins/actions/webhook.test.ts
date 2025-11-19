import { webhookAction } from './webhook';

describe('webhook action', () => {
  it('returns webhook payload', async () => {
    const res = await webhookAction.execute({} as any, { url: 'https://hook', payload: { a: 1 } });
    expect(res.type).toBe('webhook');
    expect(res.url).toBe('https://hook');
    expect(res.payload).toEqual({ a: 1 });
  });
});


