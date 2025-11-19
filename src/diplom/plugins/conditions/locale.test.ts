import { localeCondition } from './locale';

describe('locale condition', () => {
  it('matches locale', () => {
    const res = localeCondition.match({ locale: 'ru-RU' } as any, { in: ['ru-ru', 'en-us'] });
    expect(res).toBe(true);
  });
  it('returns false when context missing or not in list', () => {
    expect(localeCondition.match({} as any, { in: ['en-us'] })).toBe(false);
    expect(localeCondition.match({ locale: 'fr-FR' } as any, { in: ['ru-ru'] })).toBe(false);
  });
});


