import { Command } from './Command';
import { Velocity, VelocityMutable } from '../Movement/Movable';

export class SetVelocityCommand implements Command {
  private readonly target: VelocityMutable;
  private readonly velocity: Velocity;

  constructor(target: VelocityMutable, velocity: Velocity) {
    this.target = target;
    this.velocity = velocity;
  }

  execute(): void {
    this.target.setVelocity(this.velocity);
  }
}


