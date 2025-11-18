import { Command } from './Command';

export class CommandQueue {
  private readonly items: Command[] = [];

  enqueue(command: Command): void {
    this.items.push(command);
  }

  dequeue(): Command | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

