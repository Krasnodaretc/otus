import { Command } from './Command';
import { Rotator } from '../Rotation/Rotator';
import { Rotatable } from '../Rotation/Rotatable';

export class RotateCommand implements Command {
  private readonly rotator: Rotator;
  private readonly target: Rotatable;

  constructor(target: Rotatable, rotator: Rotator = new Rotator()) {
    this.target = target;
    this.rotator = rotator;
  }

  execute(): void {
    this.rotator.rotate(this.target);
  }
}


