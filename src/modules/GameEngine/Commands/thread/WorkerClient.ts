import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';

import { InboundMessageDTO } from '../../Messaging/types';

type WorkerIn =
  | { type: 'start' }
  | { type: 'startGame'; gameId: string }
  | { type: 'enqueue'; command: { kind: 'callback'; id: string } }
  | { type: 'enqueue'; command: { kind: 'sleep'; ms: number } }
  | { type: 'enqueue'; command: { kind: 'interpret'; dto: InboundMessageDTO } }
  | { type: 'hardStop' }
  | { type: 'softStop' };

type WorkerOut =
  | { type: 'started' }
  | { type: 'executed'; id?: string }
  | { type: 'stopped' }
  | { type: 'state'; gameId: string; snapshot: unknown };

export class WorkerClient {
  private worker: Worker | null = null;

  async start(): Promise<void> {
    if (this.worker) return;
    const jsEntry = path.resolve(__dirname, 'workerEntry.js');
    if (fs.existsSync(jsEntry)) {
      this.worker = new Worker(jsEntry);
    } else {
      const tsEntry = path.resolve(__dirname, 'workerEntry.ts');
      const code = `require('ts-node/register'); require(${JSON.stringify(tsEntry)});`;
      this.worker = new Worker(code, { eval: true });
    }
    await new Promise<void>((resolve) => {
      const onMsg = (m: WorkerOut) => {
        if (m.type === 'started') {
          this.worker!.off('message', onMsg);
          resolve();
        }
      };
      this.worker!.on('message', onMsg);
      this.worker!.postMessage({ type: 'start' } satisfies WorkerIn);
    });
  }

  async hardStop(): Promise<void> {
    if (!this.worker) return;
    await new Promise<void>((resolve) => {
      const onMsg = (m: WorkerOut) => {
        if (m.type === 'stopped') {
          this.worker!.off('message', onMsg);
          resolve();
        }
      };
      this.worker!.on('message', onMsg);
      this.worker!.postMessage({ type: 'hardStop' } satisfies WorkerIn);
    });
    await this.worker.terminate();
    this.worker = null;
  }

  async softStop(): Promise<void> {
    if (!this.worker) return;
    await new Promise<void>((resolve) => {
      const onMsg = (m: WorkerOut) => {
        if (m.type === 'stopped') {
          this.worker!.off('message', onMsg);
          resolve();
        }
      };
      this.worker!.on('message', onMsg);
      this.worker!.postMessage({ type: 'softStop' } satisfies WorkerIn);
    });
    await this.worker.terminate();
    this.worker = null;
  }

  enqueueCallback(id: string): void {
    if (!this.worker) throw new Error('Worker is not started');
    this.worker.postMessage({ type: 'enqueue', command: { kind: 'callback', id } } satisfies WorkerIn);
  }

  enqueueSleep(ms: number): void {
    if (!this.worker) throw new Error('Worker is not started');
    this.worker.postMessage({ type: 'enqueue', command: { kind: 'sleep', ms } } satisfies WorkerIn);
  }

  onExecuted(cb: (id?: string) => void): void {
    if (!this.worker) throw new Error('Worker is not started');
    const listener = (m: WorkerOut) => { if (m.type === 'executed') cb(m.id); };
    this.worker.on('message', listener);
  }

  startGame(gameId: string): void {
    if (!this.worker) throw new Error('Worker is not started');
    this.worker.postMessage({ type: 'startGame', gameId } satisfies WorkerIn);
  }

  enqueueInterpret(dto: InboundMessageDTO): void {
    if (!this.worker) throw new Error('Worker is not started');
    this.worker.postMessage({ type: 'enqueue', command: { kind: 'interpret', dto } } satisfies WorkerIn);
  }

  onState(cb: (gameId: string, snapshot: unknown) => void): void {
    if (!this.worker) throw new Error('Worker is not started');
    const listener = (m: WorkerOut) => { if (m.type === 'state') cb(m.gameId, m.snapshot); };
    this.worker.on('message', listener);
  }
}


