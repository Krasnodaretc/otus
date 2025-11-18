import { runInterpret } from './interpret';
import { CommandQueue } from '../../GameEngine/Commands/CommandQueue';
import { Command } from '../../GameEngine/Commands/Command';

class DummyCommand implements Command { executed = false; execute(): void { this.executed = true; } }

test('runInterpret resolves object and operation and enqueues command with ownership ok', () => {
  const queue = new CommandQueue();
  const dto = { gameId: 'g1', objectId: 'o1', operationId: 'move', args: { v: 2 }, playerId: 'p1' } as any;

  const owners = new Map<string, string>([['o1', 'p1']]);
  const ioc = {
    Resolve: (key: unknown, ...args: unknown[]) => {
      if (key === 'Scopes.Current' || key === 'Scopes.New' || key === 'IoC.Register') {
        return { execute: () => {} };
      }
      if (key === 'Game.OwnerStore') {
        return owners;
      }
      if (key === 'Game.ObjectAccessor') {
        return (id: string) => ({ id });
      }
      if (key === 'Game.Operation') {
        const opId = (args as unknown[])[0] as string | undefined;
        expect(opId).toBe('move');
        return (_obj: unknown, _a: unknown) => new DummyCommand();
      }
      throw new Error('Unexpected key');
    },
  };

  runInterpret(ioc as any, queue, 'g1', dto);
  const cmd = queue.dequeue();
  expect(cmd).toBeInstanceOf(DummyCommand);
});

test('runInterpret throws on foreign ownership', () => {
  const queue = new CommandQueue();
  const dto = { gameId: 'g1', objectId: 'o1', operationId: 'move', args: {}, playerId: 'p1' } as any;
  const owners = new Map<string, string>([['o1', 'p2']]);
  const ioc = {
    Resolve: (key: unknown, ..._args: unknown[]) => {
      if (key === 'Scopes.Current' || key === 'Scopes.New' || key === 'IoC.Register') {
        return { execute: () => {} };
      }
      if (key === 'Game.OwnerStore') {
        return owners;
      }
      if (key === 'Game.ObjectAccessor') {
        return (id: string) => ({ id });
      }
      if (key === 'Game.Operation') {
        return (_obj: unknown, _a: unknown) => new DummyCommand();
      }
      throw new Error('Unexpected key');
    },
  };
  expect(() => runInterpret(ioc as any, queue, 'g1', dto)).toThrow('Forbidden');
  expect(queue.dequeue()).toBeUndefined();
});

test('runInterpret handles system operation without objectId', () => {
  const queue = new CommandQueue();
  const dto = { gameId: 'g1', operationId: 'noop', args: {}, playerId: 'p1' } as any;
  const ioc = {
    Resolve: (key: unknown, ...args: unknown[]) => {
      if (key === 'Scopes.Current' || key === 'Scopes.New' || key === 'IoC.Register') {
        return { execute: () => {} };
      }
      if (key === 'System.Operation') {
        const opId = (args as unknown[])[0] as string | undefined;
        expect(opId).toBe('noop');
        return (_obj: unknown, _a: unknown) => new DummyCommand();
      }
      throw new Error('Unexpected key');
    },
  };
  runInterpret(ioc as any, queue, 'g1', dto);
  const cmd = queue.dequeue();
  expect(cmd).toBeInstanceOf(DummyCommand);
});


