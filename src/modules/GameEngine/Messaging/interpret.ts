import { CommandQueue } from '../../GameEngine/Commands/CommandQueue';
import { Command } from '../../GameEngine/Commands/Command';
import { InboundMessageDTO } from './types';

type Token = string | symbol | Function | object;

interface IocLike {
  Resolve<T = any>(key: Token, ...args: unknown[]): T;
}

export function runInterpret(ioc: IocLike, queue: CommandQueue, gameId: string, dto: InboundMessageDTO): void {
  ioc.Resolve('Scopes.Current', `game:${gameId}`).execute();
  ioc.Resolve('Scopes.New', `game:${gameId}:player:${dto.playerId}`).execute();
  ioc.Resolve('Scopes.Current', `game:${gameId}:player:${dto.playerId}`).execute();
  ioc.Resolve('IoC.Register', 'Player.CurrentId', () => dto.playerId).execute();
  const hasObject = typeof dto.objectId === 'string' && dto.objectId.length > 0;
  let command: Command;
  if (hasObject) {
    const getObject = ioc.Resolve<(id: string) => unknown>('Game.ObjectAccessor');
    const object = getObject(dto.objectId!);
    const owners = ioc.Resolve<Map<string, string>>('Game.OwnerStore');
    const ownerId = owners.get(dto.objectId!);
    if (ownerId !== dto.playerId) {
      throw new Error('Forbidden');
    }
    const opFactory = ioc.Resolve<(...a: unknown[]) => Command>('Game.Operation', dto.operationId);
    command = opFactory(object, dto.args);
  } else {
    const opFactory = ioc.Resolve<(...a: unknown[]) => Command>('System.Operation', dto.operationId);
    command = opFactory(undefined, dto.args);
  }
  queue.enqueue(command);
}


