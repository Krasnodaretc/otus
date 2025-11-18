import { Command, WrapperCommand } from './Command';

export class RetryTwiceCommand implements WrapperCommand {
  private readonly target: Command;

  constructor(target: Command) {
    this.target = target;
  }

  getTarget(): Command {
    return this.target;
  }

  execute(): void {
    this.target.execute();
  }
}


