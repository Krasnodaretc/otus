import { parentPort } from 'worker_threads';
import { Command } from '../Command';
import { CommandQueue } from '../CommandQueue';
import { ExceptionProcessor, LogExceptionHandler } from '../ExceptionHandling';
import { MemoryLogger } from '../Logger';
import { QueueProcessor } from '../QueueProcessor';

type InMessage =
  | { type: 'start' }
  | { type: 'enqueue'; command: { kind: 'callback'; id: string } }
  | { type: 'enqueue'; command: { kind: 'sleep'; ms: number } }
  | { type: 'hardStop' }
  | { type: 'softStop' };

type OutMessage =
  | { type: 'started' }
  | { type: 'executed'; id?: string }
  | { type: 'stopped' };

if (!parentPort) {
  process.exit(1);
}

const logger = new MemoryLogger();
const queue = new CommandQueue();
const processor = new ExceptionProcessor(queue, () => new LogExceptionHandler(logger));
const runner = new QueueProcessor(queue, processor);

class CallbackCommand implements Command {
  private readonly id: string;
  constructor(id: string) { this.id = id; }
  execute(): void { parentPort!.postMessage({ type: 'executed', id: this.id } as OutMessage); }
}

class SleepCommand implements Command {
  private readonly ms: number;
  constructor(ms: number) { this.ms = ms; }
  execute(): void {
    const start = Date.now();
    while (Date.now() - start < this.ms) {}
  }
}

parentPort.on('message', async (msg: InMessage) => {
  if (msg.type === 'start') {
    parentPort!.postMessage({ type: 'started' } as OutMessage);
    void runner.runLoop();
    return;
  }
  if (msg.type === 'enqueue') {
    const c = msg.command;
    if (c.kind === 'callback') {
      queue.enqueue(new CallbackCommand(c.id));
    } else if (c.kind === 'sleep') {
      queue.enqueue(new SleepCommand(c.ms));
    }
    return;
  }
  if (msg.type === 'hardStop') {
    runner.hardStop();
    parentPort!.postMessage({ type: 'stopped' } as OutMessage);
    return;
  }
  if (msg.type === 'softStop') {
    runner.softStop();
    parentPort!.postMessage({ type: 'stopped' } as OutMessage);
    return;
  }
});


