import { Command, isWrapperCommand } from './Command';
import { CommandQueue } from './CommandQueue';
import { LogCommand } from './LogCommand';
import { Logger } from './Logger';
import { RetryCommand } from './RetryCommand';

export interface ExceptionHandler {
  handle(error: unknown, command: Command, enqueue: (c: Command) => void): void;
}

export class LogExceptionHandler implements ExceptionHandler {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  handle(error: unknown, command: Command, enqueue: (c: Command) => void): void {
    enqueue(new LogCommand({ error, source: command, logger: this.logger }));
  }
}

export class RetryExceptionHandler implements ExceptionHandler {
  handle(_error: unknown, command: Command, enqueue: (c: Command) => void): void {
    enqueue(new RetryCommand(command));
  }
}

export class CompositeExceptionStrategy implements ExceptionHandler {
  private readonly steps: ExceptionHandler[];
  private currentIndex = 0;

  constructor(steps: ExceptionHandler[]) {
    this.steps = steps;
  }

  handle(error: unknown, command: Command, enqueue: (c: Command) => void): void {
    if (this.steps.length === 0) {
      return;
    }
    const handler = this.steps[Math.min(this.currentIndex, this.steps.length - 1)];
    handler.handle(error, command, (c) => enqueue(c));
    this.currentIndex += 1;
  }
}

export class ExceptionProcessor {
  private readonly queue: CommandQueue;
  private readonly strategySelector: (error: unknown, command: Command) => ExceptionHandler;

  constructor(queue: CommandQueue, selector: (error: unknown, command: Command) => ExceptionHandler) {
    this.queue = queue;
    this.strategySelector = selector;
  }

  handle(error: unknown, command: Command): void {
    const source = this.unwrap(command);
    const handler = this.strategySelector(error, source);
    handler.handle(error, source, (c) => this.queue.enqueue(c));
  }

  private unwrap(command: Command): Command {
    let current: Command = command;
    const visited = new Set<Command>();
    while (isWrapperCommand(current)) {
      if (visited.has(current)) {
        break;
      }
      visited.add(current);
      const next = current.getTarget();
      if (!next || next === current) {
        break;
      }
      current = next;
    }
    return current;
  }
}


