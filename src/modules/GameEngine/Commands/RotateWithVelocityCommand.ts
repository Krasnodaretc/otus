import { Command } from './Command';
import { MacroCommand } from './MacroCommand';
import { ChangeVelocityCommand } from './ChangeVelocityCommand';
import { RotateCommand } from './RotateCommand';
import { Rotatable } from '../Rotation/Rotatable';

export class RotateWithVelocityCommand implements Command {
  private readonly macro: MacroCommand;

  constructor(target: Rotatable) {
    this.macro = new MacroCommand([
      new RotateCommand(target),
      new ChangeVelocityCommand(target),
    ]);
  }

  execute(): void {
    this.macro.execute();
  }
}


