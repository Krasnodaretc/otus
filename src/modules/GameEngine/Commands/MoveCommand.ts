import { Command } from './Command';
import { LinearMover } from '../Movement/LinearMover';
import { Movable } from '../Movement/Movable';

export class MoveCommand implements Command {
  private readonly mover: LinearMover;
  private readonly target: Movable;

  constructor(target: Movable, mover: LinearMover = new LinearMover()) {
    this.target = target;
    this.mover = mover;
  }

  execute(): void {
    this.mover.move(this.target);
  }
}


