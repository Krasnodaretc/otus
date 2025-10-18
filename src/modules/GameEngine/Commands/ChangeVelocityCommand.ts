import { Command } from './Command';
import { Velocity, VelocityMutable } from '../Movement/Movable';
import { Rotatable } from '../Rotation/Rotatable';

export class ChangeVelocityCommand implements Command {
  private readonly rotatable: Rotatable;
  private readonly target: VelocityMutable | Rotatable;

  constructor(target: VelocityMutable | Rotatable) {
    this.target = target;
    this.rotatable = target as Rotatable;
  }

  execute(): void {
    const anyTarget = this.target as any;
    if (typeof anyTarget.getVelocity !== 'function' || typeof anyTarget.setVelocity !== 'function') {
      return;
    }

    const angle = this.rotatable.getAngle();
    const angularVelocity = this.rotatable.getAngularVelocity();
    if (!Number.isFinite(angle) || !Number.isFinite(angularVelocity)) {
      return;
    }
    const v: Velocity = anyTarget.getVelocity();
    if (!v || !Number.isFinite(v.x) || !Number.isFinite(v.y)) {
      return;
    }

    const phi = angularVelocity;
    const cos = Math.cos(phi);
    const sin = Math.sin(phi);
    const rotated: Velocity = { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos };
    anyTarget.setVelocity(rotated);
  }
}


