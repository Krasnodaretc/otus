import { WorkerClient } from './WorkerClient';
import { StartWorkerCommand } from './StartWorkerCommand';
import { HardStopWorkerCommand } from './HardStopWorkerCommand';
import { SoftStopWorkerCommand } from './SoftStopWorkerCommand';

describe('Worker commands as Command pattern', () => {
  test('StartWorkerCommand starts worker', async () => {
    const client = new WorkerClient();
    new StartWorkerCommand(client).execute();
    await client.hardStop();
  });

  test('HardStopWorkerCommand stops worker immediately', async () => {
    const client = new WorkerClient();
    await client.start();
    client.enqueueSleep(50);
    new HardStopWorkerCommand(client).execute();
    await new Promise((r) => setTimeout(r, 10));
  });

  test('SoftStopWorkerCommand drains tasks before stopping', async () => {
    const client = new WorkerClient();
    await client.start();
    const executed: string[] = [];
    client.onExecuted((id) => { if (id) executed.push(id); });
    client.enqueueCallback('a');
    client.enqueueCallback('b');
    new SoftStopWorkerCommand(client).execute();
    await new Promise((r) => setTimeout(r, 20));
    expect(executed).toEqual(['a', 'b']);
  });
});


