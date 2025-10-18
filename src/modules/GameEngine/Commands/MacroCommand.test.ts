import { MacroCommand } from './MacroCommand';
import { Command } from './Command';
import { CommandException } from '../Errors';

class Ok implements Command {
  executed = false;
  execute(): void {
    this.executed = true;
  }
}

class Fail implements Command {
  execute(): void {
    throw new Error('fail');
  }
}

describe('MacroCommand', () => {
  test('executes all commands in order', () => {
    const a = new Ok();
    const b = new Ok();
    const macro = new MacroCommand([a, b]);
    macro.execute();
    expect(a.executed).toBe(true);
    expect(b.executed).toBe(true);
  });

  test('stops and throws CommandException on failure', () => {
    const a = new Ok();
    const f = new Fail();
    const b = new Ok();
    const macro = new MacroCommand([a, f, b]);
    expect(() => macro.execute()).toThrow(CommandException);
    expect(a.executed).toBe(true);
    expect(b.executed).toBe(false);
  });
});


