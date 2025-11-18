import { MacroCommand } from "../Commands/MacroCommand";
import { Movable, Position, Velocity } from "../Movement/Movable";
import { NeighborhoodGrid } from "./NeighborhoodGrid";
import { MultiNeighborhoodCommand } from "./MultiNeighborhoodCommand";
import { CollisionCollector, CollisionDetector } from "./types";

class TestMovable implements Movable {
  private p: Position;
  private v: Velocity;
  constructor(position: Position, velocity: Velocity = { x: 0, y: 0 }) {
    this.p = position;
    this.v = velocity;
  }
  getPosition(): Position {
    return this.p;
  }
  getVelocity(): Velocity {
    return this.v;
  }
  setPosition(position: Position): void {
    this.p = position;
  }
}

class TrueDetector implements CollisionDetector {
  check(): boolean {
    return true;
  }
}

class SetCollector implements CollisionCollector {
  public readonly pairs = new Set<string>();
  add(a: Movable, b: Movable): void {
    const key = `${Math.min(a as unknown as number, b as unknown as number)}:${Math.max(
      a as unknown as number,
      b as unknown as number
    )}`;
    this.pairs.add(key);
  }
}

describe("MultiNeighborhoodCommand", () => {
  test("detects boundary neighbor only in shifted grid", () => {
    const grid1 = new NeighborhoodGrid(10, { x: 0, y: 0 });
    const grid2 = new NeighborhoodGrid(10, { x: 5, y: 5 });

    const a = new TestMovable({ x: 9, y: 0 });
    const b = new TestMovable({ x: 11, y: 0 });

    grid1.moveObject(b);
    grid2.moveObject(b);

    const detector = new TrueDetector();
    const collector = new SetCollector();
    const cmd = new MultiNeighborhoodCommand(a, [grid1, grid2], detector, collector);
    cmd.execute();

    const macro1 = grid1.getMacro(a);
    const macro2 = grid2.getMacro(a);
    expect(macro1).toBeInstanceOf(MacroCommand);
    expect(macro2).toBeInstanceOf(MacroCommand);
    macro1!.execute();
    macro2!.execute();
    expect(collector.pairs.size).toBe(1);
  });

  test("works with arbitrary number of grids", () => {
    const grids = [
      new NeighborhoodGrid(8, { x: 0, y: 0 }),
      new NeighborhoodGrid(9, { x: 3, y: 1 }),
      new NeighborhoodGrid(7, { x: 2, y: 3 }),
    ];
    const a = new TestMovable({ x: 14, y: 20 });
    const b = new TestMovable({ x: 16, y: 20 });
    for (const g of grids) g.moveObject(b);
    const detector = new TrueDetector();
    const collector = new SetCollector();
    const cmd = new MultiNeighborhoodCommand(a, grids, detector, collector);
    expect(() => cmd.execute()).not.toThrow();
  });
});


