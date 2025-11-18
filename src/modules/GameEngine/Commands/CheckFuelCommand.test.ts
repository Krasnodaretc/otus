import { CheckFuelCommand } from './CheckFuelCommand';
import { CommandException } from '../Errors';
import { FuelCarrier } from '../Movement/Movable';

class StubFuel implements FuelCarrier {
  private level: number;
  private readonly consumption: number;
  constructor(level: number, consumption: number) {
    this.level = level;
    this.consumption = consumption;
  }
  getFuelLevel(): number {
    return this.level;
  }
  getFuelConsumption(): number {
    return this.consumption;
  }
  setFuelLevel(level: number): void {
    this.level = level;
  }
}

describe('CheckFuelCommand', () => {
  test('passes when fuel is sufficient', () => {
    const stub = new StubFuel(10, 3);
    const cmd = new CheckFuelCommand(stub);
    expect(() => cmd.execute()).not.toThrow();
  });

  test('throws when fuel is insufficient', () => {
    const stub = new StubFuel(2, 3);
    const cmd = new CheckFuelCommand(stub);
    expect(() => cmd.execute()).toThrow(CommandException);
  });

  test('throws on invalid fuel state', () => {
    const stub = new StubFuel(NaN, 1);
    const cmd = new CheckFuelCommand(stub);
    expect(() => cmd.execute()).toThrow(CommandException);
  });
});


