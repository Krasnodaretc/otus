import { IoC, createIoC } from "./index";

describe("IoC container", () => {
  test("registers and resolves value", () => {
    const cmd = IoC.Resolve("IoC.Register", "answer", () => 42);
    cmd.execute();
    const value = IoC.Resolve<number>("answer");
    expect(value).toBe(42);
  });

  test("registers factory with (args) signature and resolves with args array", () => {
    const cmd = IoC.Resolve(
      "IoC.Register",
      "sum",
      (args: unknown[]) => {
        const [a, b] = args as [number, number];
        return a + b;
      }
    );
    cmd.execute();
    const result = IoC.Resolve<number>("sum", 2, 3);
    expect(result).toBe(5);
  });

  test("supports symbol and constructor tokens as keys", () => {
    const sym = Symbol("service");
    class S {}
    const reg1 = IoC.Resolve("IoC.Register", sym, () => 7);
    reg1.execute();
    const reg2 = IoC.Resolve("IoC.Register", S, () => new S());
    reg2.execute();

    expect(IoC.Resolve<number>(sym)).toBe(7);
    const inst = IoC.Resolve<S>(S);
    expect(inst).toBeInstanceOf(S);
  });

  test("createIoC returns isolated container instances", () => {
    const a = createIoC();
    const b = createIoC();
    const sym = Symbol("iso");

    a.Resolve("IoC.Register", sym, () => "A").execute();
    b.Resolve("IoC.Register", sym, () => "B").execute();

    expect(a.Resolve<string>(sym)).toBe("A");
    expect(b.Resolve<string>(sym)).toBe("B");
  });

  test("supports Scopes.New and Scopes.Current", () => {
    const regRoot = IoC.Resolve("IoC.Register", "k", () => "root");
    regRoot.execute();

    const newScope = IoC.Resolve("Scopes.New", "child");
    newScope.execute();
    const switchToChild = IoC.Resolve("Scopes.Current", "child");
    switchToChild.execute();

    const regChild = IoC.Resolve("IoC.Register", "k", () => "child");
    regChild.execute();

    const vChild = IoC.Resolve<string>("k");
    expect(vChild).toBe("child");

    const switchToRoot = IoC.Resolve("Scopes.Current", "root");
    switchToRoot.execute();
    const vRoot = IoC.Resolve<string>("k");
    expect(vRoot).toBe("root");
  });

  test("inherits registrations from parent scope", () => {
    const switchToRoot = IoC.Resolve("Scopes.Current", "root");
    switchToRoot.execute();

    const regBase = IoC.Resolve("IoC.Register", "base", () => "base");
    regBase.execute();

    const newScope = IoC.Resolve("Scopes.New", "child2");
    newScope.execute();
    const switchToChild = IoC.Resolve("Scopes.Current", "child2");
    switchToChild.execute();

    const inherited = IoC.Resolve<string>("base");
    expect(inherited).toBe("base");
  });

  test("isolates current scope across concurrent async flows", async () => {
    const toRoot = IoC.Resolve("Scopes.Current", "root");
    toRoot.execute();
    const regBase = IoC.Resolve("IoC.Register", "v", () => "root");
    regBase.execute();

    const newA = IoC.Resolve("Scopes.New", "A");
    newA.execute();
    const newB = IoC.Resolve("Scopes.New", "B");
    newB.execute();

    const flowA = async () => {
      IoC.Resolve("Scopes.Current", "A").execute();
      IoC.Resolve("IoC.Register", "v", () => "A").execute();
      await new Promise((r) => setTimeout(r, 10));
      return IoC.Resolve<string>("v");
    };

    const flowB = async () => {
      IoC.Resolve("Scopes.Current", "B").execute();
      IoC.Resolve("IoC.Register", "v", () => "B").execute();
      await new Promise((r) => setTimeout(r, 5));
      return IoC.Resolve<string>("v");
    };

    const [va, vb] = await Promise.all([flowA(), flowB()]);
    expect(va).toBe("A");
    expect(vb).toBe("B");

    const backToRoot = IoC.Resolve("Scopes.Current", "root");
    backToRoot.execute();
    expect(IoC.Resolve<string>("v")).toBe("root");
  });
});


