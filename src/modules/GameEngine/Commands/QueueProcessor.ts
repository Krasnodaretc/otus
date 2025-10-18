import { Command } from './Command';
import { CommandQueue } from './CommandQueue';
import { ExceptionProcessor } from './ExceptionHandling';

export class QueueProcessor {
  private readonly queue: CommandQueue;
  private readonly exceptionProcessor: ExceptionProcessor;

  constructor(queue: CommandQueue, exceptionProcessor: ExceptionProcessor) {
    this.queue = queue;
    this.exceptionProcessor = exceptionProcessor;
  }

  runOnce(): void {
    const command = this.queue.dequeue();
    if (!command) {
      return;
    }
    try {
      command.execute();
    } catch (error) {
      this.exceptionProcessor.handle(error, command);
    }
  }
}


