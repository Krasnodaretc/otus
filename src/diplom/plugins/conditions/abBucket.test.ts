import { abBucketCondition } from './abBucket';

describe('abBucket condition', () => {
  it('matches when bucket in list', () => {
    const res = abBucketCondition.match({ abBucket: 'B' } as any, { in: ['A', 'B'] });
    expect(res).toBe(true);
  });
  it('fails when no bucket', () => {
    const res = abBucketCondition.match({} as any, { in: ['A'] });
    expect(res).toBe(false);
  });
});


