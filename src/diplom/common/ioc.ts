export type Constructor<T> = new (...args: any[]) => T;

export class Container {
  private singletons = new Map<string, unknown>();
  private factories = new Map<string, () => unknown>();

  registerSingleton<T>(token: string, instance: T): void {
    this.singletons.set(token, instance);
  }

  registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }

    const factory = this.factories.get(token);

    if (factory) {
      const created = factory() as T;

      this.singletons.set(token, created);

      return created;
    }

    throw new Error(`Dependency not found: ${token}`);
  }
}

export const globalContainer = new Container();


