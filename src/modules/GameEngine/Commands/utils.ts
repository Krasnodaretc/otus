import { Command, isWrapperCommand } from './Command';

export function unwrapCommand(command: Command): Command {
  let current: Command = command;
  const visited = new Set<Command>();
  while (isWrapperCommand(current)) {
    if (visited.has(current)) {
      break;
    }
    visited.add(current);
    const next = current.getTarget();
    if (!next || next === current) {
      break;
    }
    current = next;
  }
  return current;
}


