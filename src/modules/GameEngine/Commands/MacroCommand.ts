import { Command } from './Command';
import { CommandException } from '../Errors';

export class MacroCommand implements Command {
  private readonly commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands.slice();
  }

  execute(): void {
    for (const cmd of this.commands) {
      try {
        cmd.execute();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new CommandException(`Macro failed: ${message}`);
      }
    }
  }
}


