import { EventRepositoryMongo } from './MongoRepositories';
import { EventModel } from '../../db/schemas';

jest.mock('../../db/schemas', () => ({
  EventModel: {
    aggregate: jest.fn(),
    create: jest.fn(),
  },
  MetricDailyModel: {
    updateOne: jest.fn(),
  },
}));

describe('EventRepositoryMongo aggregateByDate variants', () => {
  it('maps missing fields to defaults', async () => {
    (EventModel.aggregate as any).mockResolvedValueOnce([
      { _id: {}, count: undefined },
      { _id: { slug: 's' }, count: 5 },
    ]);
    const repo = new EventRepositoryMongo();
    const rows = await repo.aggregateByDate('2024-01-01');
    expect(rows).toEqual([
      { slug: '', type: '', count: 0 },
      { slug: 's', type: '', count: 5 },
    ]);
  });
});


