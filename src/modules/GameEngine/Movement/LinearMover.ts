import { Movable, Position } from './Movable';

export class LinearMover {
  move(object: Movable): void {
    let position: Position;
    let velocity: Position;

    try {
      position = object.getPosition();
    } catch {
      throw new Error('Cannot read position');
    }

    try {
      velocity = object.getVelocity();
    } catch {
      throw new Error('Cannot read velocity');
    }

    if (
      !position ||
      typeof position.x !== 'number' ||
      typeof position.y !== 'number' ||
      !Number.isFinite(position.x) ||
      !Number.isFinite(position.y)
    ) {
      throw new Error('Cannot read position');
    }

    if (
      !velocity ||
      typeof velocity.x !== 'number' ||
      typeof velocity.y !== 'number' ||
      !Number.isFinite(velocity.x) ||
      !Number.isFinite(velocity.y)
    ) {
      throw new Error('Cannot read velocity');
    }

    const newPosition: Position = {
      x: position.x + velocity.x,
      y: position.y + velocity.y,
    };

    try {
      object.setPosition(newPosition);
    } catch {
      throw new Error('Cannot write position');
    }
  }
}


