import { geoCondition } from './geo';

describe('geo condition', () => {
  it('matches when country in list', () => {
    const res = geoCondition.match({ geo: { country: 'RU' } } as any, { in: ['ru','by'] });

    expect(res).toBe(true);
  });
  it('returns false when missing geo or not in list', () => {
    expect(geoCondition.match({} as any, { in: ['ru'] })).toBe(false);
    expect(geoCondition.match({ geo: { country: 'US' } } as any, { in: ['ru'] })).toBe(false);
  });
});


