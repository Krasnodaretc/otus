import { Command } from './Command';
import { MacroCommand } from './MacroCommand';
import { CheckFuelCommand } from './CheckFuelCommand';
import { BurnFuelCommand } from './BurnFuelCommand';
import { MoveCommand } from './MoveCommand';
import { FuelCarrier, Movable } from '../Movement/Movable';

export class MovementWithFuelCommand implements Command {
  private readonly macro: MacroCommand;

  constructor(target: Movable & FuelCarrier) {
    this.macro = new MacroCommand([
      new CheckFuelCommand(target),
      new MoveCommand(target),
      new BurnFuelCommand(target),
    ]);
  }

  execute(): void {
    this.macro.execute();
  }
}


