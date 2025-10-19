import { Command } from './Command';
import { CommandQueue } from './CommandQueue';
import { ExceptionProcessor } from './ExceptionHandling';

export class QueueProcessor {
  private readonly queue: CommandQueue;
  private readonly exceptionProcessor: ExceptionProcessor;
  private running = false;

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

  async runLoop(): Promise<void> {
    this.running = true;
    while (this.running) {
      const command = await this.queue.take();
      if (!command) {
        continue;
      }
      try {
        command.execute();
      } catch (error) {
        this.exceptionProcessor.handle(error, command);
      }
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
  }

  hardStop(): void {
    this.running = false;
    this.queue.wakeup();
  }

  softStop(): void {
    this.running = false;
    this.queue.wakeup();
    while (!this.queue.isEmpty()) {
      const command = this.queue.dequeue();
      if (!command) break;
      try {
        command.execute();
      } catch (error) {
        this.exceptionProcessor.handle(error, command);
      }
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}


