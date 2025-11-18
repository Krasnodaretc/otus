import { QuadraticSolver } from './modules/QuadraticSolver';
export * from './modules/GameEngine';

const solver = new QuadraticSolver();

console.log('OTUS Homework - Part 1: Quadratic Equation Solver Demo');
console.log('======================================================');

console.log('\nExample 1: x^2 + 1 = 0 (no real roots)');
console.log('Roots:', solver.solve(1, 0, 1));

console.log('\nExample 2: x^2 - 1 = 0 (two roots)');
console.log('Roots:', solver.solve(1, 0, -1));

console.log('\nExample 3: x^2 + 2x + 1 = 0 (one root)');
console.log('Roots:', solver.solve(1, 2, 1));

try {
  console.log('\nExample 4: 0x^2 + x + 1 = 0 (invalid)');
  solver.solve(0, 1, 1);
} catch (error) {
  console.log('Error:', (error as Error).message);
}

export { QuadraticSolver };