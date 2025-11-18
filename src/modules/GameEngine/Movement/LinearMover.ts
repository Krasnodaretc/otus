import { Movable, Position, Velocity } from './Movable';
import { PositionReadError, VelocityReadError, PositionWriteError } from '../Errors';

export class LinearMover {
  move(object: Movable): void {
    let position: Position;
    let velocity: Velocity;

    try {
      position = object.getPosition();
    } catch {
      throw new PositionReadError('Cannot read position');
    }

    try {
      velocity = object.getVelocity();
    } catch {
      throw new VelocityReadError('Cannot read velocity');
    }

    if (
      !position ||
      typeof position.x !== 'number' ||
      typeof position.y !== 'number' ||
      !Number.isFinite(position.x) ||
      !Number.isFinite(position.y)
    ) {
      throw new PositionReadError('Cannot read position');
    }

    if (
      !velocity ||
      typeof velocity.x !== 'number' ||
      typeof velocity.y !== 'number' ||
      !Number.isFinite(velocity.x) ||
      !Number.isFinite(velocity.y)
    ) {
      throw new VelocityReadError('Cannot read velocity');
    }

    const newPosition: Position = {
      x: position.x + velocity.x,
      y: position.y + velocity.y,
    };

    try {
      object.setPosition(newPosition);
    } catch {
      throw new PositionWriteError('Cannot write position');
    }
  }
}


