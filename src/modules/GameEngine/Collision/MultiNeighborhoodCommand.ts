import { Command } from "../Commands/Command";
import type { Movable } from "../Movement/Movable";
import type { CollisionCollector, CollisionDetector } from "./types";
import { NeighborhoodGrid } from "./NeighborhoodGrid";
import { UpdateNeighborhoodCommand } from "./UpdateNeighborhoodCommand";

export class MultiNeighborhoodCommand implements Command {
  private readonly obj: Movable;
  private readonly grids: NeighborhoodGrid[];
  private readonly detector: CollisionDetector;
  private readonly collector: CollisionCollector;

  constructor(
    obj: Movable,
    grids: NeighborhoodGrid[],
    detector: CollisionDetector,
    collector: CollisionCollector
  ) {
    this.obj = obj;
    this.grids = grids.slice();
    this.detector = detector;
    this.collector = collector;
  }

  execute(): void {
    for (const grid of this.grids) {
      new UpdateNeighborhoodCommand(this.obj, grid, this.detector, this.collector).execute();
    }
  }
}


