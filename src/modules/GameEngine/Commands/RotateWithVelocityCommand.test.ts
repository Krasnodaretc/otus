import { RotateWithVelocityCommand } from './RotateWithVelocityCommand';
import { VelocityMutable, Position, Velocity } from '../Movement/Movable';
import { Rotatable } from '../Rotation/Rotatable';

class StubRotatableVelocity implements VelocityMutable, Rotatable {
  private position: Position = { x: 0, y: 0 };
  private velocity: Velocity = { x: 1, y: 0 };
  private angle = 0;
  private angularVelocity = Math.PI / 2;
  getPosition(): Position { return this.position; }
  getVelocity(): Velocity { return this.velocity; }
  setPosition(p: Position): void { this.position = p; }
  setVelocity(v: Velocity): void { this.velocity = v; }
  getAngle(): number { return this.angle; }
  setAngle(a: number): void { this.angle = a; }
  getAngularVelocity(): number { return this.angularVelocity; }
}

class StubRotatableOnly implements Rotatable {
  private angle = 0;
  private angularVelocity = Math.PI / 2;
  getAngle(): number { return this.angle; }
  setAngle(a: number): void { this.angle = a; }
  getAngularVelocity(): number { return this.angularVelocity; }
}

describe('RotateWithVelocityCommand', () => {
  test('rotates object and adjusts velocity vector when available', () => {
    const obj = new StubRotatableVelocity();
    const cmd = new RotateWithVelocityCommand(obj);
    cmd.execute();
    const v = obj.getVelocity();
    expect(Math.round(v.x)).toBe(0);
    expect(Math.round(v.y)).toBe(1);
  });

  test('rotates object without velocity change when not movable', () => {
    const obj = new StubRotatableOnly();
    const cmd = new RotateWithVelocityCommand(obj);
    expect(() => cmd.execute()).not.toThrow();
  });
});


