import path from 'path';
import { WorkerClient } from './WorkerClient';

describe('WorkerClient (worker_threads)', () => {
  test('start signals started event', async () => {
    const client = new WorkerClient();
    await client.start();
    await client.hardStop();
  });

  test('hard stop stops immediately (sleep remains)', async () => {
    const client = new WorkerClient();
    await client.start();
    client.enqueueSleep(50);
    await client.hardStop();
  });

  test('soft stop drains queued tasks', async () => {
    const client = new WorkerClient();
    await client.start();
    const executed: string[] = [];
    client.onExecuted((id) => { if (id) executed.push(id); });
    client.enqueueCallback('a');
    client.enqueueCallback('b');
    await client.softStop();
    expect(executed).toEqual(['a', 'b']);
  });

  test('enqueue interpret does not crash worker', async () => {
    const client = new WorkerClient();
    await client.start();
    client.startGame('g1');
    client.enqueueInterpret({
      gameId: 'g1',
      operationId: 'Noop',
      args: {},
      playerId: 'p1',
    });
    await client.softStop();
  });
});


