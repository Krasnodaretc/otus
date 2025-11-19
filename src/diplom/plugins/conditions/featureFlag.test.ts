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
});


