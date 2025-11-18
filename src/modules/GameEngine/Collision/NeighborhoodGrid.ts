import { MacroCommand } from "../Commands/MacroCommand";
import type { Movable, Position } from "../Movement/Movable";

export type GridOffset = { x: number; y: number };

export class NeighborhoodGrid {
  private readonly cellSize: number;
  private readonly offset: GridOffset;
  private readonly objectToCell: Map<Movable, string> = new Map();
  private readonly cellToObjects: Map<string, Set<Movable>> = new Map();
  private readonly perObjectMacro: Map<Movable, MacroCommand> = new Map();

  constructor(cellSize: number, offset: GridOffset) {
    this.cellSize = cellSize;
    this.offset = offset;
  }

  getCellKeyForPosition(position: Position): string {
    const cx = Math.floor((position.x - this.offset.x) / this.cellSize);
    const cy = Math.floor((position.y - this.offset.y) / this.cellSize);
    return `${cx}:${cy}`;
  }

  getCurrentCellKey(obj: Movable): string | undefined {
    return this.objectToCell.get(obj);
  }

  computeCellKey(obj: Movable): string {
    return this.getCellKeyForPosition(obj.getPosition());
  }

  getObjectsInCell(cellKey: string): Set<Movable> {
    return this.cellToObjects.get(cellKey) ?? new Set();
  }

  getNeighborsFor(obj: Movable, cellKey: string): Movable[] {
    const objects = this.getObjectsInCell(cellKey);
    const result: Movable[] = [];
    for (const other of objects) {
      if (other !== obj) {
        result.push(other);
      }
    }
    return result;
  }

  moveObject(obj: Movable): { changed: boolean; oldKey?: string; newKey: string } {
    const newKey = this.computeCellKey(obj);
    const oldKey = this.objectToCell.get(obj);
    if (oldKey === newKey) {
      return { changed: false, oldKey, newKey };
    }
    if (oldKey) {
      const oldSet = this.cellToObjects.get(oldKey);
      if (oldSet) {
        oldSet.delete(obj);
        if (oldSet.size === 0) {
          this.cellToObjects.delete(oldKey);
        }
      }
    }
    let newSet = this.cellToObjects.get(newKey);
    if (!newSet) {
      newSet = new Set();
      this.cellToObjects.set(newKey, newSet);
    }
    newSet.add(obj);
    this.objectToCell.set(obj, newKey);
    return { changed: true, oldKey, newKey };
  }

  setMacro(obj: Movable, macro: MacroCommand): void {
    this.perObjectMacro.set(obj, macro);
  }

  getMacro(obj: Movable): MacroCommand | undefined {
    return this.perObjectMacro.get(obj);
  }
}


