import { isAction, isCondition } from './loader';

describe('loader type guards', () => {
  it('detects condition', () => {
    expect(isCondition({ match: () => true })).toBe(true);
    expect(isCondition({})).toBe(false);
    expect(isCondition(null)).toBe(false as any);
  });
  it('detects action', () => {
    expect(isAction({ execute: () => ({ type: 'redirect', url: '' }) })).toBe(true);
    expect(isAction({})).toBe(false);
    expect(isAction(null)).toBe(false as any);
  });
});


