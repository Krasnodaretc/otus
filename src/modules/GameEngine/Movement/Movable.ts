export type Position = {
  x: number;
  y: number;
};

export type Velocity = {
  x: number;
  y: number;
};

export interface Movable {
  getPosition(): Position;
  getVelocity(): Velocity;
  setPosition(position: Position): void;
}


