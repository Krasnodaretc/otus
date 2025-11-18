import { Command } from './Command';
import { ExceptionHandler, LogExceptionHandler, RetryExceptionHandler } from './ExceptionHandling';
import { Logger } from './Logger';
import { RetryTwiceCommand } from './RetryTwiceCommand';

export function createRetryThenLogStrategy(logger: Logger): ExceptionHandler {
  let firstTime = true;
  return {
    handle(error: unknown, command: Command, enqueue: (c: Command) => void): void {
      if (firstTime) {
        firstTime = false;
        new RetryExceptionHandler().handle(error, command, enqueue);
      } else {
        new LogExceptionHandler(logger).handle(error, command, enqueue);
      }
    },
  };
}

export function createRetryTwiceThenLogStrategy(logger: Logger): ExceptionHandler {
  let retryCount = 0;
  return {
    handle(error: unknown, command: Command, enqueue: (c: Command) => void): void {
      if (retryCount < 2) {
        retryCount += 1;
        enqueue(new RetryTwiceCommand(command));
      } else {
        new LogExceptionHandler(logger).handle(error, command, enqueue);
      }
    },
  };
}


