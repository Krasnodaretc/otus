import { parentPort } from 'worker_threads';
import { Command } from '../Command';
import { CommandQueue } from '../CommandQueue';
import { ExceptionProcessor, LogExceptionHandler } from '../ExceptionHandling';
import { MemoryLogger } from '../Logger';
import { QueueProcessor } from '../QueueProcessor';
import { IoC } from '../../../IoC';
import { InboundMessageDTO } from '../../Messaging/types';
import { runInterpret } from '../../Messaging/interpret';

type InMessage =
  | { type: 'start' }
  | { type: 'startGame'; gameId: string }
  | { type: 'enqueue'; command: { kind: 'callback'; id: string } }
  | { type: 'enqueue'; command: { kind: 'sleep'; ms: number } }
  | { type: 'enqueue'; command: { kind: 'interpret'; dto: InboundMessageDTO } }
  | { type: 'hardStop' }
  | { type: 'softStop' };

type OutMessage =
  | { type: 'started' }
  | { type: 'executed'; id?: string }
  | { type: 'stopped' }
  | { type: 'state'; gameId: string; snapshot: unknown };

if (!parentPort) {
  process.exit(1);
}

const logger = new MemoryLogger();
const queue = new CommandQueue();
const processor = new ExceptionProcessor(queue, () => new LogExceptionHandler(logger));
const runner = new QueueProcessor(queue, processor);
let currentGameId: string | null = null;

class InterpretCommand implements Command {
  private readonly dto: InboundMessageDTO;
  constructor(dto: InboundMessageDTO) { this.dto = dto; }
  execute(): void {
    if (!currentGameId) return;
    const targetQueue = IoC.Resolve<CommandQueue>('Game.CommandQueue');
    runInterpret(IoC, targetQueue, currentGameId, this.dto);
  }
}

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
  if (msg.type === 'startGame') {
    currentGameId = msg.gameId;
    const scopeId = `game:${currentGameId}`;
    IoC.Resolve('Scopes.New', scopeId).execute();
    IoC.Resolve('Scopes.Current', scopeId).execute();
    IoC.Resolve('IoC.Register', 'Game.CommandQueue', () => queue).execute();
    return;
  }
  if (msg.type === 'enqueue') {
    const c = msg.command;
    if (c.kind === 'callback') {
      queue.enqueue(new CallbackCommand(c.id));
    } else if (c.kind === 'sleep') {
      queue.enqueue(new SleepCommand(c.ms));
    } else if (c.kind === 'interpret') {
      queue.enqueue(new InterpretCommand(c.dto));
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


