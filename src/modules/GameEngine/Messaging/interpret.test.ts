import { runInterpret } from './interpret';
import { CommandQueue } from '../../GameEngine/Commands/CommandQueue';
import { Command } from '../../GameEngine/Commands/Command';

class DummyCommand implements Command { executed = false; execute(): void { this.executed = true; } }

test('runInterpret resolves object and operation and enqueues command', () => {
  const queue = new CommandQueue();
  const dto = { gameId: 'g1', objectId: 'o1', operationId: 'move', args: { v: 2 } } as any;

  const ioc = {
    Resolve: (key: unknown, ...args: unknown[]) => {
      if (key === 'Scopes.Current') {
        return { execute: () => {} };
      }
      if (key === 'Game.ObjectAccessor') {
        return (id: string) => ({ id });
      }
      if (key === 'Game.Operation') {
        const opId = (args as unknown[])[0] as string | undefined;
        expect(opId).toBe('move');
        return (obj: unknown, a: unknown) => new DummyCommand();
      }
      throw new Error('Unexpected key');
    },
  };

  runInterpret(ioc as any, queue, 'g1', dto);
  const cmd = queue.dequeue();
  expect(cmd).toBeInstanceOf(DummyCommand);
});


