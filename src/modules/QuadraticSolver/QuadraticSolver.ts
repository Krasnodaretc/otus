export class QuadraticSolver {
  private static readonly EPSILON = 1e-10;

  solve(a: number, b: number, c: number): number[] {
    if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
      throw new Error('Invalid coefficient values');
    }

    if (Math.abs(a) < QuadraticSolver.EPSILON) {
      throw new Error('Coefficient a cannot be zero');
    }

    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < -QuadraticSolver.EPSILON) {
      return [];
    }
    
    if (Math.abs(discriminant) <= QuadraticSolver.EPSILON) {
      const x = -b / (2 * a);
      return [x];
    }
    
    if (discriminant > QuadraticSolver.EPSILON) {
      const sqrt = Math.sqrt(discriminant);
      const x1 = (-b + sqrt) / (2 * a);
      const x2 = (-b - sqrt) / (2 * a);
      return [x1, x2];
    }
    
    return [];
  }
}