import { Command } from './Command';
import { CommandQueue } from './CommandQueue';
import { ExceptionProcessor, LogExceptionHandler } from './ExceptionHandling';
import { MemoryLogger } from './Logger';
import { QueueProcessor } from './QueueProcessor';
import { HardStopCommand } from './HardStopCommand';
import { MoveToCommand } from './MoveToCommand';
import { RunCommand } from './RunCommand';
import { NormalState } from './States/NormalState';

class CountingCommand implements Command {
  private readonly counter: { value: number };
  constructor(counter: { value: number }) {
    this.counter = counter;
  }
  execute(): void {
    this.counter.value += 1;
  }
}

describe('QueueProcessor state machine', () => {
  test('stops loop after HardStopCommand', async () => {
    const queue = new CommandQueue();
    const logger = new MemoryLogger();
    const processor = new ExceptionProcessor(queue, () => new LogExceptionHandler(logger));
    const runner = new QueueProcessor(queue, processor, new NormalState());

    const loop = runner.runLoop();
    queue.enqueue(new HardStopCommand());

    await loop;
  });

  test('switches to MoveTo state after MoveToCommand', () => {
    const source = new CommandQueue();
    const target = new CommandQueue();
    const logger = new MemoryLogger();
    const processor = new ExceptionProcessor(source, () => new LogExceptionHandler(logger));
    const runner = new QueueProcessor(source, processor, new NormalState());

    source.enqueue(new MoveToCommand(target));
    runner.runOnce();

    const marker = new CountingCommand({ value: 0 });
    source.enqueue(marker);
    runner.runOnce();

    const redirected = target.dequeue();
    expect(redirected).toBe(marker);
  });

  test('returns to Normal state after RunCommand', () => {
    const source = new CommandQueue();
    const target = new CommandQueue();
    const logger = new MemoryLogger();
    const processor = new ExceptionProcessor(source, () => new LogExceptionHandler(logger));
    const runner = new QueueProcessor(source, processor, new NormalState());

    source.enqueue(new MoveToCommand(target));
    runner.runOnce();

    source.enqueue(new RunCommand());
    runner.runOnce();

    const counter = { value: 0 };
    source.enqueue(new CountingCommand(counter));
    runner.runOnce();

    expect(counter.value).toBe(1);
    expect(target.isEmpty()).toBe(true);
  });
});


