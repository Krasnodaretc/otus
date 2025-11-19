import { localeCondition } from './locale';

describe('locale condition', () => {
  it('matches locale', () => {
    const res = localeCondition.match({ locale: 'ru-RU' } as any, { in: ['ru-ru', 'en-us'] });
    expect(res).toBe(true);
  });
});


