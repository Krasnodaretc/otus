import { Command } from './Command';
import { CommandQueue } from './CommandQueue';

export class MoveToCommand implements Command {
  private readonly target: CommandQueue;

  constructor(target: CommandQueue) {
    this.target = target;
  }

  getTarget(): CommandQueue {
    return this.target;
  }

  execute(): void {}
}


