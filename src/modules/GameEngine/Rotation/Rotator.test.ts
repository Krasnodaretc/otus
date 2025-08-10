import { Rotator } from './Rotator';
import { Rotatable } from './Rotatable';

class TestRotatable implements Rotatable {
  private angleValue: number;
  private angularVelocityValue: number;
  private writable: boolean;

  constructor(angle: number, angularVelocity: number, writable: boolean = true) {
    this.angleValue = angle;
    this.angularVelocityValue = angularVelocity;
    this.writable = writable;
  }

  getAngle(): number {
    return this.angleValue;
  }

  setAngle(angle: number): void {
    if (!this.writable) {
      throw new Error('not writable');
    }
    this.angleValue = angle;
  }

  getAngularVelocity(): number {
    return this.angularVelocityValue;
  }
}

describe('Rotator', () => {
  test('rotates by angular velocity', () => {
    const rotator = new Rotator();
    const obj = new TestRotatable(10, 5);
    rotator.rotate(obj);
    expect(obj.getAngle()).toBe(15);
  });

  test('throws error if cannot read angle', () => {
    const rotator = new Rotator();
    const bad: Rotatable = {
      getAngle: () => Number.NaN as unknown as number,
      setAngle: () => {},
      getAngularVelocity: () => 1,
    };
    expect(() => rotator.rotate(bad)).toThrow('Cannot read angle');
  });

  test('throws error if cannot read angular velocity', () => {
    const rotator = new Rotator();
    const bad: Rotatable = {
      getAngle: () => 0,
      setAngle: () => {},
      getAngularVelocity: () => Number.NaN as unknown as number,
    };
    expect(() => rotator.rotate(bad)).toThrow('Cannot read angular velocity');
  });

  test('throws error if cannot write angle', () => {
    const rotator = new Rotator();
    const obj = new TestRotatable(0, 1, false);
    expect(() => rotator.rotate(obj)).toThrow('Cannot write angle');
  });
});


