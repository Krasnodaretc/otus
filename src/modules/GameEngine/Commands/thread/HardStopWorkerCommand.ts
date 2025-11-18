import { Command } from '../Command';
import { WorkerClient } from './WorkerClient';

export class HardStopWorkerCommand implements Command {
  private readonly client: WorkerClient;

  constructor(client: WorkerClient) {
    this.client = client;
  }

  execute(): void {
    void this.client.hardStop();
  }
}


