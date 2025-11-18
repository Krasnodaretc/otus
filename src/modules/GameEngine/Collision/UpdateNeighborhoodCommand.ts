import { Command } from "../Commands/Command";
import { MacroCommand } from "../Commands/MacroCommand";
import type { Movable } from "../Movement/Movable";
import type { CollisionCollector, CollisionDetector } from "./types";
import { NeighborhoodGrid } from "./NeighborhoodGrid";
import { CheckCollisionCommand } from "./CheckCollisionCommand";

export class UpdateNeighborhoodCommand implements Command {
  private readonly obj: Movable;
  private readonly grid: NeighborhoodGrid;
  private readonly detector: CollisionDetector;
  private readonly collector: CollisionCollector;

  constructor(obj: Movable, grid: NeighborhoodGrid, detector: CollisionDetector, collector: CollisionCollector) {
    this.obj = obj;
    this.grid = grid;
    this.detector = detector;
    this.collector = collector;
  }

  execute(): void {
    const move = this.grid.moveObject(this.obj);
    if (!move.changed) {
      return;
    }
    const neighbors = this.grid.getNeighborsFor(this.obj, move.newKey);
    const cmds = neighbors.map((n) => new CheckCollisionCommand(this.obj, n, this.detector, this.collector));
    const macro = new MacroCommand(cmds);
    this.grid.setMacro(this.obj, macro);
  }
}


