import { BurnFuelCommand } from './BurnFuelCommand';
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

describe('BurnFuelCommand', () => {
  test('reduces fuel level by consumption', () => {
    const stub = new StubFuel(10, 3);
    const cmd = new BurnFuelCommand(stub);
    cmd.execute();
    expect(stub.getFuelLevel()).toBe(7);
  });

  test('throws when fuel is insufficient', () => {
    const stub = new StubFuel(2, 3);
    const cmd = new BurnFuelCommand(stub);
    expect(() => cmd.execute()).toThrow(CommandException);
  });
});


