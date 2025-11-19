import { readString, readStringArray, readNumber } from './utils';

describe('plugins utils', () => {
  it('readString returns string or undefined', () => {
    expect(readString({ a: 'x' }, 'a')).toBe('x');
    expect(readString({ a: 1 }, 'a')).toBeUndefined();
  });
  it('readStringArray filters strings', () => {
    expect(readStringArray({ a: ['x', 1, 'y'] }, 'a')).toEqual(['x', 'y']);
    expect(readStringArray({}, 'a')).toEqual([]);
  });
  it('readNumber parses number and numeric string', () => {
    expect(readNumber({ n: 5 }, 'n')).toBe(5);
    expect(readNumber({ n: '6' }, 'n')).toBe(6);
    expect(readNumber({ n: 'a' }, 'n')).toBeUndefined();
  });
});


