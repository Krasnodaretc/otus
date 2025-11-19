jest.mock('../../db/schemas', () => ({
  EventModel: {
    aggregate: () => [
      { _id: { slug: 's', type: 'click' }, count: 3 },
      { _id: { slug: 's', type: 'redirect' }, count: 1 },
    ],
  },
  MetricDailyModel: { updateOne: jest.fn() },
}));

import { EventRepositoryMongo, MetricRepositoryMongo } from './MongoRepositories';
import { MetricDailyModel } from '../../db/schemas';

describe('MongoRepositories analytics', () => {
  it('aggregateByDate maps output', async () => {
    const repo = new EventRepositoryMongo();
    const rows = await repo.aggregateByDate('2025-01-01');
    expect(rows[0].slug).toBe('s');
    expect(rows.find(r => r.type === 'click')?.count).toBe(3);
  });
  it('upsertDaily delegates to model', async () => {
    const repo = new MetricRepositoryMongo();
    await repo.upsertDaily({ date: '2025-01-01', slug: 's', metrics: { clicks: 1, redirects: 0, matched: 0, errors: 0 } });
    expect(MetricDailyModel.updateOne).toHaveBeenCalled();
  });
});


