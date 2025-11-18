import { Command, WrapperCommand } from './Command';
import { IoC } from '../../IoC';

export class AuthorizeOwnershipCommand implements WrapperCommand {
  private readonly inner: Command;
  private readonly objectId: string;

  constructor(inner: Command, objectId: string) {
    this.inner = inner;
    this.objectId = objectId;
  }

  execute(): void {
    const owners = IoC.Resolve<Map<string, string>>('Game.OwnerStore');
    const currentPlayerId = IoC.Resolve<string>('Player.CurrentId');
    const ownerId = owners.get(this.objectId);
    if (!ownerId || ownerId !== currentPlayerId) {
      throw new Error('Forbidden');
    }
    this.inner.execute();
  }

  getTarget(): Command {
    return this.inner;
  }
}


