import { CommandQueue } from '../../GameEngine/Commands/CommandQueue';
import { Command } from '../../GameEngine/Commands/Command';
import { InboundMessageDTO } from './types';

type Token = string | symbol | Function | object;

interface IocLike {
  Resolve<T = any>(key: Token, ...args: unknown[]): T;
}

export function runInterpret(ioc: IocLike, queue: CommandQueue, gameId: string, dto: InboundMessageDTO): void {
  ioc.Resolve('Scopes.Current', `game:${gameId}`).execute();
  const getObject = ioc.Resolve<(id: string) => unknown>('Game.ObjectAccessor');
  const object = getObject(dto.objectId);
  const opFactory = ioc.Resolve<(...a: unknown[]) => Command>('Game.Operation', dto.operationId);
  const command = opFactory(object, dto.args);
  queue.enqueue(command);
}


