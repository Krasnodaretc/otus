import { Command } from './Command';

export class CommandQueue {
  private readonly items: Command[] = [];
  private readonly waiters: Array<(cmd?: Command) => void> = [];

  enqueue(command: Command): void {
    const waiter = this.waiters.shift();
    if (waiter) {
      waiter(command);
      return;
    }
    this.items.push(command);
  }

  dequeue(): Command | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  async take(): Promise<Command | undefined> {
    const existing = this.dequeue();
    if (existing) {
      return existing;
    }
    return new Promise((resolve) => {
      this.waiters.push(resolve);
    });
  }

  wakeup(): void {
    while (this.waiters.length > 0) {
      const resolve = this.waiters.shift();
      if (resolve) resolve(undefined);
    }
  }

  clear(): void {
    this.items.length = 0;
  }
}

