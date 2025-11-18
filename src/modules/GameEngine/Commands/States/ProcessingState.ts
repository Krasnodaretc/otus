import { Command } from '../Command';
import { ExceptionProcessor } from '../ExceptionHandling';

export interface ProcessingContext {
  exceptionProcessor: ExceptionProcessor;
}

export interface ProcessingState {
  handle(command: Command, context: ProcessingContext): ProcessingState | null;
}


