export interface Command {
  execute(): void;
}

export interface WrapperCommand extends Command {
  getTarget(): Command;
}

export function isWrapperCommand(command: Command): command is WrapperCommand {
  return typeof (command as any).getTarget === 'function';
}
