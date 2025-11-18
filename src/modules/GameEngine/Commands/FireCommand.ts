import { Command } from './Command';

export class FireCommand implements Command {
  private readonly action: () => void;

  constructor(action: () => void) {
    this.action = action;
  }

  execute(): void {
    this.action();
  }
}


