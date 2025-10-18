import { QuadraticSolver } from './QuadraticSolver';

describe('QuadraticSolver', () => {
  let solver: QuadraticSolver;

  beforeEach(() => {
    solver = new QuadraticSolver();
  });

  test('should return empty array for equation x^2+1=0 (no real roots)', () => {
    const result = solver.solve(1, 0, 1);
    expect(result).toEqual([]);
  });

  test('should return two roots for equation x^2-1=0 (x1=1, x2=-1)', () => {
    const result = solver.solve(1, 0, -1);
    expect(result).toHaveLength(2);
    expect(result).toContain(1);
    expect(result).toContain(-1);
  });

  test('should return one root with multiplicity 2 for equation x^2+2x+1=0 (x=-1)', () => {
    const result = solver.solve(1, 2, 1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(-1);
  });

  test('should throw error when coefficient a is zero', () => {
    expect(() => solver.solve(0, 1, 1)).toThrow('Coefficient a cannot be zero');
  });

  test('should throw error when coefficient a is very close to zero', () => {
    const epsilon = 1e-10;
    expect(() => solver.solve(epsilon / 2, 1, 1)).toThrow('Coefficient a cannot be zero');
  });

  test('should handle discriminant close to zero as single root', () => {
    const a = 1;
    const b = 2e-6;
    const c = 1e-12;
    
    const result = solver.solve(a, b, c);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeCloseTo(-1e-6, 10);
  });

  test('should throw error when coefficient a is NaN', () => {
    expect(() => solver.solve(NaN, 1, 1)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient b is NaN', () => {
    expect(() => solver.solve(1, NaN, 1)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient c is NaN', () => {
    expect(() => solver.solve(1, 1, NaN)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient a is Infinity', () => {
    expect(() => solver.solve(Infinity, 1, 1)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient b is Infinity', () => {
    expect(() => solver.solve(1, Infinity, 1)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient c is Infinity', () => {
    expect(() => solver.solve(1, 1, Infinity)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient a is negative Infinity', () => {
    expect(() => solver.solve(-Infinity, 1, 1)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient b is negative Infinity', () => {
    expect(() => solver.solve(1, -Infinity, 1)).toThrow('Invalid coefficient values');
  });

  test('should throw error when coefficient c is negative Infinity', () => {
    expect(() => solver.solve(1, 1, -Infinity)).toThrow('Invalid coefficient values');
  });
});