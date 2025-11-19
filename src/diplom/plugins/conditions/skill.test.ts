import { skillCondition } from './skill';

describe('skill condition', () => {
  it('matches when has any skill', () => {
    const res = skillCondition.match({ skills: ['JS','TS'] } as any, { hasAny: ['ts'] });
    expect(res).toBe(true);
  });
  it('returns false when no skills or no match', () => {
    expect(skillCondition.match({} as any, { hasAny: ['js'] })).toBe(false);
    expect(skillCondition.match({ skills: ['go'] } as any, { hasAny: ['js'] })).toBe(false);
  });
});


