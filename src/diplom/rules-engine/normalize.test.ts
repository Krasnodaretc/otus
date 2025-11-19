import { toConditionNode } from './normalize';

describe('normalize', () => {
  it('converts any/ all structures', () => {
    const any = toConditionNode({ any: [{ type: 'skill', hasAny: ['a'] }] });
    expect(any.type).toBe('any');
    const all = toConditionNode({ all: [{ type: 'skill', hasAny: ['a'] }] });
    expect(all.type).toBe('all');
  });
  it('throws on invalid node', () => {
    expect(() => toConditionNode({} as any)).toThrow();
  });
});


