import { IoC } from './index';
import { registerAdapter } from './Adapter';

type Position = { x: number; y: number };
type Velocity = { x: number; y: number };

interface Movable {
  getPosition(): Position;
  getVelocity(): Velocity;
  setPosition(position: Position): void;
  finish(): void;
}

describe('Adapter resolver', () => {
  test('creates Movable adapter and routes getters/setters', () => {
    const obj = {};
    registerAdapter(IoC);

    IoC.Resolve('IoC.Register', 'Spaceship.Operations.IMovable:position.get', () => ({ x: 1, y: 2 })).execute();
    IoC.Resolve('IoC.Register', 'Spaceship.Operations.IMovable:velocity.get', () => ({ x: 3, y: 4 })).execute();

    const setArgs: any[] = [];
    IoC.Resolve('IoC.Register', 'Spaceship.Operations.IMovable:position.set', (...args: unknown[]) => ({
      execute: () => {
        setArgs.push(args);
      },
    })).execute();

    const adapter = IoC.Resolve<Movable>('Adapter', 'Spaceship.Operations.IMovable', obj);

    const p = adapter.getPosition();
    const v = adapter.getVelocity();
    adapter.setPosition({ x: 10, y: 20 });

    expect(p).toEqual({ x: 1, y: 2 });
    expect(v).toEqual({ x: 3, y: 4 });
    expect(setArgs.length).toBe(1);
    expect(setArgs[0][0]).toBe(obj);
    expect(setArgs[0][1]).toEqual({ x: 10, y: 20 });
  });

  test('invokes arbitrary void method via command', () => {
    const obj = {};
    registerAdapter(IoC);
    const called: any[] = [];
    IoC.Resolve('IoC.Register', 'Spaceship.Operations.IMovable:finish', (...args: unknown[]) => ({
      execute: () => called.push(args),
    })).execute();

    const adapter = IoC.Resolve<Movable>('Adapter', 'Spaceship.Operations.IMovable', obj);
    adapter.finish();

    expect(called.length).toBe(1);
    expect(called[0][0]).toBe(obj);
  });
});


