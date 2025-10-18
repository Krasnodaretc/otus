import { Rotatable } from './Rotatable';
import { AngleReadError, AngularVelocityReadError, AngleWriteError } from '../Errors';

export class Rotator {
  rotate(object: Rotatable): void {
    let angle: number;
    let angularVelocity: number;

    try {
      angle = object.getAngle();
    } catch {
      throw new AngleReadError('Cannot read angle');
    }

    try {
      angularVelocity = object.getAngularVelocity();
    } catch {
      throw new AngularVelocityReadError('Cannot read angular velocity');
    }

    if (!Number.isFinite(angle)) {
      throw new AngleReadError('Cannot read angle');
    }
    if (!Number.isFinite(angularVelocity)) {
      throw new AngularVelocityReadError('Cannot read angular velocity');
    }

    const newAngle = angle + angularVelocity;

    try {
      object.setAngle(newAngle);
    } catch {
      throw new AngleWriteError('Cannot write angle');
    }
  }
}


