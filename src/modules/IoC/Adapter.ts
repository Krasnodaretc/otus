import { Command } from '../GameEngine/Commands';
import type { IoCToken } from './index';

export interface IoCLike {
  Resolve<T = any>(key: IoCToken, ...args: unknown[]): T;
}

export function registerAdapter(container: IoCLike): void {
  const toCamel = (s: string): string => {
    if (!s) return s;
    if (s.length === 1) return s.toLowerCase();
    if (/^[A-Z]+$/.test(s)) return s.toLowerCase();
    if (/^[A-Z]{2,}[a-z]/.test(s)) return s[0].toLowerCase() + s.slice(1);
    return s[0].toLowerCase() + s.slice(1);
  };

  const classify = (name: string): { kind: 'getter' | 'setter' | 'command' | 'service'; key?: string } => {
    if (name === 'then' || name === 'toString' || name === 'valueOf' || name === 'inspect' || name === 'toJSON') {
      return { kind: 'service' };
    }
    if (name.startsWith('get') && name.length > 3) {
      return { kind: 'getter', key: toCamel(name.slice(3)) };
    }
    if (name.startsWith('set') && name.length > 3) {
      return { kind: 'setter', key: toCamel(name.slice(3)) };
    }
    return { kind: 'command', key: name };
  };

  const factory: (...args: unknown[]) => unknown = (...args: unknown[]) => {
    const [iface, obj] = args as [unknown, unknown];
    if (typeof iface !== 'string' || !iface) {
      throw new Error('Adapter requires non-empty string interface id');
    }

    const ifaceId = iface as string;

    const makeGetter = (property: string) => () => container.Resolve(`${ifaceId}:${property}.get`, obj);
    const makeSetter = (property: string) => (...callArgs: unknown[]) => {
      const cmd = container.Resolve<Command>(`${ifaceId}:${property}.set`, obj, ...callArgs);
      cmd.execute();
    };
    const makeCommand = (method: string) => (...callArgs: unknown[]) => {
      const cmd = container.Resolve<Command>(`${ifaceId}:${method}`, obj, ...callArgs);
      cmd.execute();
    };

    const handler: ProxyHandler<any> = {
      get: (_target, prop) => {
        if (typeof prop !== 'string') {
          return undefined;
        }
        const { kind, key } = classify(prop);
        switch (kind) {
          case 'service':
            if (prop === 'then') return undefined;
            if (prop === 'toJSON') return () => ({ type: 'Adapter', iface: ifaceId });
            return () => '[Adapter]';
          case 'getter':
            return (...callArgs: unknown[]) => {
              if (callArgs.length > 0) {
                throw new Error('Getter must not have arguments');
              }
              return makeGetter(key! )();
            };
          case 'setter':
            return makeSetter(key!);
          case 'command':
          default:
            return makeCommand(key!);
        }
      },
    };
    return new Proxy({}, handler);
  };

  container.Resolve('IoC.Register', 'Adapter', factory).execute();
}


