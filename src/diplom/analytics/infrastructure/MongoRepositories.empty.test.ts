jest.mock('../../db/schemas', () => ({
  EventModel: {
    aggregate: () => [],
  },
}));

import { EventRepositoryMongo } from './MongoRepositories';

describe('EventRepositoryMongo empty aggregate', () => {
  it('returns empty array', async () => {
    const repo = new EventRepositoryMongo();
    const rows = await repo.aggregateByDate('2025-01-01');
    expect(rows.length).toBe(0);
  });
});


