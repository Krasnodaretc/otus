import { Command } from './Command';
import { Logger } from './Logger';

export class LogCommand implements Command {
  private readonly error: unknown;
  private readonly source: Command;
  private readonly logger: Logger;

  constructor(params: { error: unknown; source: Command; logger: Logger }) {
    this.error = params.error;
    this.source = params.source;
    this.logger = params.logger;
  }

  execute(): void {
    const sourceName = this.source.constructor.name;
    const message = this.error instanceof Error ? this.error.message : String(this.error);
    this.logger.log(`Command failed: ${sourceName} | Error: ${message}`);
  }
}


