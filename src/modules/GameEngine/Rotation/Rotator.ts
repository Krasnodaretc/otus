import { Rotatable } from './Rotatable';

export class Rotator {
  rotate(object: Rotatable): void {
    let angle: number;
    let angularVelocity: number;

    try {
      angle = object.getAngle();
    } catch {
      throw new Error('Cannot read angle');
    }

    try {
      angularVelocity = object.getAngularVelocity();
    } catch {
      throw new Error('Cannot read angular velocity');
    }

    if (!Number.isFinite(angle)) {
      throw new Error('Cannot read angle');
    }
    if (!Number.isFinite(angularVelocity)) {
      throw new Error('Cannot read angular velocity');
    }

    const newAngle = angle + angularVelocity;

    try {
      object.setAngle(newAngle);
    } catch {
      throw new Error('Cannot write angle');
    }
  }
}


