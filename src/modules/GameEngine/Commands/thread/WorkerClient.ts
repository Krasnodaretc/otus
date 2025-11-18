import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';

type WorkerIn =
  | { type: 'start' }
  | { type: 'enqueue'; command: { kind: 'callback'; id: string } }
  | { type: 'enqueue'; command: { kind: 'sleep'; ms: number } }
  | { type: 'hardStop' }
  | { type: 'softStop' };

type WorkerOut =
  | { type: 'started' }
  | { type: 'executed'; id?: string }
  | { type: 'stopped' };

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
}


