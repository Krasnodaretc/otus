import { ChangeVelocityCommand } from './ChangeVelocityCommand';
import { VelocityMutable, Position, Velocity } from '../Movement/Movable';
import { Rotatable } from '../Rotation/Rotatable';

class StubTarget implements VelocityMutable, Rotatable {
  private position: Position = { x: 0, y: 0 };
  private velocity: Velocity = { x: 1, y: 0 };
  private angle = 0;
  private angularVelocity = Math.PI / 4;
  getPosition(): Position { return this.position; }
  getVelocity(): Velocity { return this.velocity; }
  setPosition(p: Position): void { this.position = p; }
  setVelocity(v: Velocity): void { this.velocity = v; }
  getAngle(): number { return this.angle; }
  setAngle(a: number): void { this.angle = a; }
  getAngularVelocity(): number { return this.angularVelocity; }
}

class StubRotOnly implements Rotatable {
  private angle = 0;
  private angularVelocity = Math.PI / 4;
  getAngle(): number { return this.angle; }
  setAngle(a: number): void { this.angle = a; }
  getAngularVelocity(): number { return this.angularVelocity; }
}

describe('ChangeVelocityCommand', () => {
  test('rotates velocity by angular velocity when velocity is available', () => {
    const obj = new StubTarget();
    const cmd = new ChangeVelocityCommand(obj);
    cmd.execute();
    const v = obj.getVelocity();
    const sqrt2over2 = Math.SQRT1_2;
    expect(Math.abs(v.x - sqrt2over2)).toBeLessThan(1e-10);
    expect(Math.abs(v.y - sqrt2over2)).toBeLessThan(1e-10);
  });

  test('does nothing when target does not support velocity', () => {
    const obj = new StubRotOnly();
    const cmd = new ChangeVelocityCommand(obj as unknown as VelocityMutable & Rotatable);
    expect(() => cmd.execute()).not.toThrow();
  });
});


