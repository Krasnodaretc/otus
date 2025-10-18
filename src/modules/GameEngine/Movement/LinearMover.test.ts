import { LinearMover } from './LinearMover';
import { Movable, Position, Velocity } from './Movable';
import { PositionReadError, VelocityReadError, PositionWriteError } from '../Errors';

class TestMovable implements Movable {
  private currentPosition: Position;
  private currentVelocity: Velocity;
  private writable: boolean;

  constructor(position: Position, velocity: Velocity, writable: boolean = true) {
    this.currentPosition = position;
    this.currentVelocity = velocity;
    this.writable = writable;
  }

  getPosition(): Position {
    return this.currentPosition;
  }

  getVelocity(): Velocity {
    return this.currentVelocity;
  }

  setPosition(position: Position): void {
    if (!this.writable) {
      throw new Error('not writable');
    }
    this.currentPosition = position;
  }
}

describe('LinearMover', () => {
  test('moves object from (12,5) with velocity (-7,3) to (5,8)', () => {
    const mover = new LinearMover();
    const obj = new TestMovable({ x: 12, y: 5 }, { x: -7, y: 3 });
    mover.move(obj);
    expect(obj.getPosition()).toEqual({ x: 5, y: 8 });
  });

  test('throws error if cannot read position', () => {
    const mover = new LinearMover();
    const bad: Movable = {
      getPosition: () => ({ x: Number.NaN as unknown as number, y: 0 }),
      getVelocity: () => ({ x: 1, y: 1 }),
      setPosition: () => {}
    };
    expect(() => mover.move(bad)).toThrow(PositionReadError);
  });

  test('throws error if cannot read velocity', () => {
    const mover = new LinearMover();
    const bad: Movable = {
      getPosition: () => ({ x: 0, y: 0 }),
      getVelocity: () => ({ x: Number.NaN as unknown as number, y: 1 }),
      setPosition: () => {}
    };
    expect(() => mover.move(bad)).toThrow(VelocityReadError);
  });

  test('throws error if cannot write position', () => {
    const mover = new LinearMover();
    const obj = new TestMovable({ x: 0, y: 0 }, { x: 1, y: 1 }, false);
    expect(() => mover.move(obj)).toThrow(PositionWriteError);
  });
});


