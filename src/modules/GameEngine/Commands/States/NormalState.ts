import { Command } from '../Command';
import { HardStopCommand } from '../HardStopCommand';
import { MoveToCommand } from '../MoveToCommand';
import { RunCommand } from '../RunCommand';
import { ProcessingContext, ProcessingState } from './ProcessingState';
import { MoveToState } from './MoveToState';

export class NormalState implements ProcessingState {
  handle(command: Command, context: ProcessingContext): ProcessingState | null {
    if (command instanceof HardStopCommand) {
      return null;
    }
    if (command instanceof MoveToCommand) {
      return new MoveToState(command.getTarget());
    }
    if (command instanceof RunCommand) {
      return this;
    }
    try {
      command.execute();
    } catch (error) {
      context.exceptionProcessor.handle(error, command);
    }
    return this;
  }
}


