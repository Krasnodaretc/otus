import { Command } from './Command';
import { FuelCarrier } from '../Movement/Movable';
import { CommandException } from '../Errors';

export class BurnFuelCommand implements Command {
  private readonly target: FuelCarrier;

  constructor(target: FuelCarrier) {
    this.target = target;
  }

  execute(): void {
    const level = this.target.getFuelLevel();
    const consumption = this.target.getFuelConsumption();
    if (!Number.isFinite(level) || !Number.isFinite(consumption)) {
      throw new CommandException('Invalid fuel state');
    }
    if (consumption < 0) {
      throw new CommandException('Invalid fuel consumption');
    }
    if (level < consumption) {
      throw new CommandException('Insufficient fuel');
    }
    const newLevel = level - consumption;
    this.target.setFuelLevel(newLevel);
  }
}


