import crypto from 'crypto';

export type GameId = string;
export type UserId = string;

export class BattleStorage {
  private readonly gameIdToParticipants: Map<GameId, Set<UserId>> = new Map();

  createBattle(participants: UserId[]): GameId {
    if (!Array.isArray(participants) || participants.length === 0) {
      throw new Error('Participants must be a non-empty array');
    }
    const unique = new Set<UserId>();
    for (const id of participants) {
      if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('Participant id must be a non-empty string');
      }
      unique.add(id);
    }
    const gameId = crypto.randomUUID();
    this.gameIdToParticipants.set(gameId, unique);
    return gameId;
    }

  hasParticipant(gameId: GameId, userId: UserId): boolean {
    const set = this.gameIdToParticipants.get(gameId);
    if (!set) return false;
    return set.has(userId);
  }
}


