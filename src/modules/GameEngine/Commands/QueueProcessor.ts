import { Command } from './Command';
import { CommandQueue } from './CommandQueue';
import { ExceptionProcessor } from './ExceptionHandling';
import { ProcessingContext, ProcessingState } from './States/ProcessingState';

export class QueueProcessor {
  private readonly queue: CommandQueue;
  private readonly exceptionProcessor: ExceptionProcessor;
  private running = false;
  private state: ProcessingState | null;

  constructor(queue: CommandQueue, exceptionProcessor: ExceptionProcessor, initialState?: ProcessingState) {
    this.queue = queue;
    this.exceptionProcessor = exceptionProcessor;
    this.state = initialState ?? this.createDefaultState();
  }

  runOnce(): void {
    if (!this.state) return;
    const command = this.queue.dequeue();
    if (!command) return;
    this.state = this.state.handle(command, this.createContext());
  }

  async runLoop(): Promise<void> {
    this.running = true;
    while (this.running && this.state) {
      const command = await this.queue.take();
      if (!command) continue;
      this.state = this.state.handle(command, this.createContext());
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

  private createContext(): ProcessingContext {
    return { exceptionProcessor: this.exceptionProcessor };
  }

  private createDefaultState(): ProcessingState {
    const exceptionProcessor = this.exceptionProcessor;
    return {
      handle(command: Command): ProcessingState | null {
        try {
          command.execute();
        } catch (error) {
          exceptionProcessor.handle(error, command);
        }
        return this;
      },
    };
  }
}
