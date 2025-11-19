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
  it('returns default when input is falsy', () => {
    const n = toConditionNode(null as any);
    expect(n.type).toBe('all');
    expect(Array.isArray(n.conditions)).toBe(true);
  });
  it('passes through leaf node', () => {
    const leaf = { type: 'skill', hasAny: ['a'] } as any;
    const n = toConditionNode(leaf);
    expect(n).toBe(leaf);
  });
  it('handles non-array any/all gracefully', () => {
    expect(toConditionNode({ any: 'x' } as any).type).toBe('any');
    expect(toConditionNode({ all: 'x' } as any).type).toBe('all');
  });
});


