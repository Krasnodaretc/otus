import { MacroCommand } from "../Commands/MacroCommand";
import { Movable, Position, Velocity } from "../Movement/Movable";
import { NeighborhoodGrid } from "./NeighborhoodGrid";
import { UpdateNeighborhoodCommand } from "./UpdateNeighborhoodCommand";
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

class PairCollector implements CollisionCollector {
  public readonly pairs: Array<[Movable, Movable]> = [];
  add(a: Movable, b: Movable): void {
    this.pairs.push([a, b]);
  }
}

describe("UpdateNeighborhoodCommand", () => {
  test("moves object between cells and builds macro for neighbors", () => {
    const grid = new NeighborhoodGrid(10, { x: 0, y: 0 });
    const a = new TestMovable({ x: 0, y: 0 });
    const b = new TestMovable({ x: 5, y: 5 });
    grid.moveObject(b);

    const detector = new TrueDetector();
    const collector = new PairCollector();
    const cmd = new UpdateNeighborhoodCommand(a, grid, detector, collector);

    cmd.execute();
    expect(grid.getCurrentCellKey(a)).toBe("0:0");
    const cellObjects = grid.getObjectsInCell("0:0");
    expect(cellObjects.has(a)).toBe(true);
    expect(cellObjects.has(b)).toBe(true);

    const macro = grid.getMacro(a);
    expect(macro).toBeInstanceOf(MacroCommand);
    macro!.execute();
    expect(collector.pairs.length).toBe(1);
    expect(collector.pairs[0][0]).toBe(a);
    expect(collector.pairs[0][1]).toBe(b);

    a.setPosition({ x: 20, y: 0 });
    cmd.execute();
    expect(grid.getCurrentCellKey(a)).toBe("2:0");
    expect(grid.getObjectsInCell("2:0").has(a)).toBe(true);
    const macro2 = grid.getMacro(a);
    expect(macro2).toBeInstanceOf(MacroCommand);
    macro2!.execute();
    expect(collector.pairs.length).toBe(1);
  });

  test("does not rebuild when cell not changed", () => {
    const grid = new NeighborhoodGrid(10, { x: 0, y: 0 });
    const a = new TestMovable({ x: 1, y: 1 });
    const b = new TestMovable({ x: 2, y: 2 });
    grid.moveObject(b);
    const detector = new TrueDetector();
    const collector = new PairCollector();
    const cmd = new UpdateNeighborhoodCommand(a, grid, detector, collector);

    cmd.execute();
    const macro1 = grid.getMacro(a)!;
    macro1.execute();
    expect(collector.pairs.length).toBe(1);

    cmd.execute();
    const macro2 = grid.getMacro(a)!;
    expect(macro2).toBe(macro1);
    macro2.execute();
    expect(collector.pairs.length).toBe(2);
  });
});


