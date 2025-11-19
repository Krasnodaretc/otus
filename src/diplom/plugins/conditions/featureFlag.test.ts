import { featureFlagCondition } from './featureFlag';

describe('featureFlag condition', () => {
  it('matches when flag enabled by default', () => {
    const res = featureFlagCondition.match({ featureFlags: { x: true } } as any, { name: 'x' });
    expect(res).toBe(true);
  });
  it('matches explicit enabled=false', () => {
    const res = featureFlagCondition.match({ featureFlags: { x: false } } as any, { name: 'x', enabled: false });
    expect(res).toBe(true);
  });
  it('returns false when name missing', () => {
    const res = featureFlagCondition.match({ featureFlags: { x: true } } as any, { enabled: true } as any);
    expect(res).toBe(false);
  });
  it('returns false when expected mismatches', () => {
    const res = featureFlagCondition.match({ featureFlags: { x: true } } as any, { name: 'x', enabled: false });
    expect(res).toBe(false);
  });
});


