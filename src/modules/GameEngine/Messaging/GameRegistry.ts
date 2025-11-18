import { EventEmitter } from 'events';
import { WorkerClient } from '../../GameEngine/Commands/thread/WorkerClient';
import { InboundMessageDTO } from './types';

export class GameRegistry extends EventEmitter {
  private readonly games: Map<string, WorkerClient> = new Map();

  ensureGame(gameId: string): WorkerClient {
    let client = this.games.get(gameId);
    if (!client) {
      client = new WorkerClient();
      this.games.set(gameId, client);
      void client.start().then(() => {
        client!.startGame(gameId);
        client!.onState((id, snapshot) => {
          this.emit('state', { gameId: id, snapshot });
        });
      });
    }
    return client;
  }

  enqueueInterpret(dto: InboundMessageDTO): void {
    const client = this.ensureGame(dto.gameId);
    client.enqueueInterpret(dto);
  }
}


