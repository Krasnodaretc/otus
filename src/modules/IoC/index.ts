import { Command } from "../GameEngine/Commands";
import { AsyncLocalStorage } from "node:async_hooks";

type Factory = (...args: unknown[]) => unknown;
type Token = string | symbol | Function | object;

class IoCContainer {
  private scopes: Map<string, Map<Token, Factory>> = new Map();
  private parents: Map<string, string | null> = new Map();
  private defaultScopeId: string = "root";
  private scopeStorage = new AsyncLocalStorage<string>();

  constructor() {
    this.ensureScope("root", null);
    this.registerBuiltIns();
  }

  public Resolve<T = any>(key: Token, ...args: unknown[]): T {
    const factory = this.lookupFactory(key);
    if (!factory) {
      throw new Error(`No registration for key ${String(key)}`);
    }
    return this.invokeFactory(factory, args) as T;
  }

  public getCurrentScopeId(): string {
    return this.scopeStorage.getStore() ?? this.defaultScopeId;
  }

  private register(key: Token, factory: Factory): void {
    const scopeId = this.getCurrentScopeId();
    const scope = this.scopes.get(scopeId)!;
    scope.set(key, factory);
  }

  private ensureScope(scopeId: string, parentId: string | null): void {
    if (!this.scopes.has(scopeId)) {
      this.scopes.set(scopeId, new Map());
      this.parents.set(scopeId, parentId);
    }
  }

  private newScope(scopeId: string): void {
    const parentId = this.getCurrentScopeId();
    this.ensureScope(scopeId, parentId);
  }

  private setCurrentScope(scopeId: string): void {
    if (!this.scopes.has(scopeId)) {
      throw new Error(`Unknown scope: ${scopeId}`);
    }
    this.scopeStorage.enterWith(scopeId);
  }

  private lookupFactory(key: Token): Factory | undefined {
    let scopeId: string | null = this.getCurrentScopeId();
    while (scopeId) {
      const scope = this.scopes.get(scopeId);
      if (scope && scope.has(key)) {
        return scope.get(key);
      }
      scopeId = this.parents.get(scopeId) ?? null;
    }
    return undefined;
  }

  private invokeFactory(factory: Factory, args: unknown[]): unknown {
    if (factory.length === 1) {
      return (factory as (a: unknown[]) => unknown)(args);
    }
    return factory(...args);
  }

  private registerBuiltIns(): void {
    const registerFactory: Factory = (...args: unknown[]) => {
      const [key, factory] = args as [Token, Factory];
      const self = this;
      const cmd: Command = {
        execute(): void {
          self.register(key, factory);
        },
      };
      return cmd;
    };

    const scopesNewFactory: Factory = (...args: unknown[]) => {
      const [scopeId] = args as [string];
      const self = this;
      const cmd: Command = {
        execute(): void {
          if (!scopeId || typeof scopeId !== "string") {
            throw new Error("Scope id must be a non-empty string");
          }
          self.newScope(scopeId);
        },
      };
      return cmd;
    };

    const scopesCurrentFactory: Factory = (...args: unknown[]) => {
      const [scopeId] = args as [string];
      const self = this;
      const cmd: Command = {
        execute(): void {
          if (!scopeId || typeof scopeId !== "string") {
            throw new Error("Scope id must be a non-empty string");
          }
          self.setCurrentScope(scopeId);
        },
      };
      return cmd;
    };

    this.scopes.get("root")!.set("IoC.Register", registerFactory);
    this.scopes.get("root")!.set("Scopes.New", scopesNewFactory);
    this.scopes.get("root")!.set("Scopes.Current", scopesCurrentFactory);
  }
}

export const IoC = new IoCContainer();
export const createIoC = () => new IoCContainer();
export type { Factory as IoCFactory, Token as IoCToken };
