import { EventHandler } from '../../domain/EventDispatcher';
import { IEventRepository, EventRecord } from '../../domain/IRepositories';

export class PersistAllHandler implements EventHandler {
  constructor(private readonly repo: IEventRepository) {}
  canHandle(_evt: EventRecord) {
    return true;
  }
  async handle(evt: EventRecord) {
    await this.repo.create(evt);
  }
}


