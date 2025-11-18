import { Command } from './Command';
import { CommandQueue } from './CommandQueue';
import { ExceptionProcessor } from './ExceptionHandling';
import { MemoryLogger } from './Logger';
import { LogCommand } from './LogCommand';
import { RetryCommand } from './RetryCommand';
import { QueueProcessor } from './QueueProcessor';
import { createRetryThenLogStrategy, createRetryTwiceThenLogStrategy } from './ExceptionStrategies';

class FailingCommand implements Command {
  private readonly name: string;
  private attempts = 0;
  private readonly failTimes: number;

  constructor(name: string, failTimes: number) {
    this.name = name;
    this.failTimes = failTimes;
  }

  execute(): void {
    this.attempts += 1;
    if (this.attempts <= this.failTimes) {
      throw new Error(`${this.name} failed #${this.attempts}`);
    }
  }
}

describe('Command exception strategies', () => {
  test('first retry then log on second failure', () => {
    const queue = new CommandQueue();
    const logger = new MemoryLogger();
    const strategy = createRetryThenLogStrategy(logger);
    const processor = new ExceptionProcessor(queue, () => strategy);
    const runner = new QueueProcessor(queue, processor);

    const cmd = new FailingCommand('X', 2);
    queue.enqueue(cmd);

    runner.runOnce();
    const first = queue.dequeue();
    expect(first).toBeInstanceOf(RetryCommand);
    if (first) {
      queue.enqueue(first);
    }

    runner.runOnce();
    const second = queue.dequeue();
    expect(second).toBeInstanceOf(LogCommand);
    if (second) {
      queue.enqueue(second);
    }

    const logCmd = queue.dequeue();
    if (logCmd) {
      logCmd.execute();
    }

    expect(logger.messages.length).toBe(1);
    expect(logger.messages[0]).toContain('Command failed: FailingCommand');
  });

  test('retry twice then log on third failure', () => {
    const queue = new CommandQueue();
    const logger = new MemoryLogger();
    const strategy = createRetryTwiceThenLogStrategy(logger);
    const processor = new ExceptionProcessor(queue, () => strategy);
    const runner = new QueueProcessor(queue, processor);

    const cmd = new FailingCommand('Y', 3);
    queue.enqueue(cmd);

    runner.runOnce();
    const r1 = queue.dequeue();
    expect(r1).toBeTruthy();
    if (r1) queue.enqueue(r1);

    runner.runOnce();
    const r2 = queue.dequeue();
    expect(r2).toBeTruthy();
    if (r2) queue.enqueue(r2);

    runner.runOnce();
    const log = queue.dequeue();
    expect(log).toBeInstanceOf(LogCommand);
    if (log) queue.enqueue(log);

    const logCmd = queue.dequeue();
    if (logCmd) logCmd.execute();

    expect(logger.messages.length).toBe(1);
    expect(logger.messages[0]).toContain('Command failed: FailingCommand');
  });
});


