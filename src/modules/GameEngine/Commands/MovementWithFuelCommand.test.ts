import { MovementWithFuelCommand } from './MovementWithFuelCommand';
import { Movable, Position, Velocity, FuelCarrier } from '../Movement/Movable';
import { CommandException } from '../Errors';

class StubMovable implements Movable, FuelCarrier {
  private position: Position;
  private velocity: Velocity;
  private fuel: number;
  private readonly consumption: number;
  constructor(position: Position, velocity: Velocity, fuel: number, consumption: number) {
    this.position = position;
    this.velocity = velocity;
    this.fuel = fuel;
    this.consumption = consumption;
  }
  getPosition(): Position { return this.position; }
  getVelocity(): Velocity { return this.velocity; }
  setPosition(p: Position): void { this.position = p; }
  getFuelLevel(): number { return this.fuel; }
  getFuelConsumption(): number { return this.consumption; }
  setFuelLevel(level: number): void { this.fuel = level; }
}

describe('MovementWithFuelCommand', () => {
  test('moves and burns fuel when enough fuel', () => {
    const obj = new StubMovable({ x: 0, y: 0 }, { x: 2, y: 3 }, 10, 2);
    const cmd = new MovementWithFuelCommand(obj);
    cmd.execute();
    expect(obj.getPosition()).toEqual({ x: 2, y: 3 });
    expect(obj.getFuelLevel()).toBe(8);
  });

  test('throws when insufficient fuel and does not move', () => {
    const obj = new StubMovable({ x: 0, y: 0 }, { x: 1, y: 1 }, 0, 1);
    const cmd = new MovementWithFuelCommand(obj);
    expect(() => cmd.execute()).toThrow(CommandException);
    expect(obj.getPosition()).toEqual({ x: 0, y: 0 });
  });
});


