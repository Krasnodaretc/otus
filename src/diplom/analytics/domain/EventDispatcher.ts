import { IEventRepository, EventRecord } from './IRepositories';

export interface EventHandler {
  canHandle: (evt: EventRecord) => boolean;
  handle: (evt: EventRecord) => Promise<void>;
}

export class EventDispatcher {
  private readonly handlers: EventHandler[] = [];
  register(handler: EventHandler) {
    this.handlers.push(handler);
  }
  async dispatch(evt: EventRecord) {
    for (const h of this.handlers) {
      if (h.canHandle(evt)) {
        await h.handle(evt);
      }
    }
  }
}


