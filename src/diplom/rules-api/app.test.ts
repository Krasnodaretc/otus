import { createPreviewApp } from './app';

describe('rules-api preview endpoint', () => {
  it('returns matched rule and actions', async () => {
    const app = await createPreviewApp();
    const dsl = {
      rules: [
        {
          id: 'r1',
          if: { all: [{ type: 'skill', hasAny: ['js'] }] },
          then: [{ type: 'redirect', url: 'https://example.com/fe' }],
        },
      ],
    };
    const res = await app.inject({
      method: 'POST',
      url: '/rules/preview',
      payload: { dsl, context: { skills: ['JS'] } },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as any;

    expect(body.matchedRuleId).toBe('r1');
    expect(body.actions[0].type).toBe('redirect');
  });
});


