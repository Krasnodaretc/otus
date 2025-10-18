export interface Logger {
  log(message: string): void;
}

export class MemoryLogger implements Logger {
  public readonly messages: string[] = [];

  log(message: string): void {
    this.messages.push(message);
  }
}


