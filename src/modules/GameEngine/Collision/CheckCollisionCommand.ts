import { Command } from "../Commands/Command";
import type { Movable } from "../Movement/Movable";
import type { CollisionCollector, CollisionDetector } from "./types";

export class CheckCollisionCommand implements Command {
  private readonly a: Movable;
  private readonly b: Movable;
  private readonly detector: CollisionDetector;
  private readonly collector: CollisionCollector;

  constructor(a: Movable, b: Movable, detector: CollisionDetector, collector: CollisionCollector) {
    this.a = a;
    this.b = b;
    this.detector = detector;
    this.collector = collector;
  }

  execute(): void {
    if (this.detector.check(this.a, this.b)) {
      this.collector.add(this.a, this.b);
    }
  }
}


