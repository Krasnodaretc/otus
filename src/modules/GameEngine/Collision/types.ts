import type { Movable } from "../Movement/Movable";

export interface CollisionDetector {
  check(a: Movable, b: Movable): boolean;
}

export interface CollisionCollector {
  add(a: Movable, b: Movable): void;
}


