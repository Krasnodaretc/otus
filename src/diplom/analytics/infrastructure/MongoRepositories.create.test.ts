import { EventRepositoryMongo, MetricRepositoryMongo } from './MongoRepositories';
import { EventModel, MetricDailyModel } from '../../db/schemas';

jest.mock('../../db/schemas', () => ({
  EventModel: {
    create: jest.fn(),
    aggregate: jest.fn(),
  },
  MetricDailyModel: {
    updateOne: jest.fn(),
  },
}));

describe('EventRepositoryMongo create and MetricRepositoryMongo upsertDaily', () => {
  it('sets createdAt when missing', async () => {
    const repo = new EventRepositoryMongo();
    (EventModel.create as any).mockResolvedValueOnce(true);
    const before = Date.now();
    await repo.create({ slug: 's', type: 'hit' } as any);
    const arg = (EventModel.create as any).mock.calls[0][0];
    expect(arg.slug).toBe('s');
    expect(arg.type).toBe('hit');
    expect(new Date(arg.createdAt).getTime()).toBeGreaterThanOrEqual(before);
  });
  it('keeps provided createdAt', async () => {
    const repo = new EventRepositoryMongo();
    (EventModel.create as any).mockResolvedValueOnce(true);
    const ts = new Date('2024-01-02T00:00:00Z');
    await repo.create({ slug: 's', type: 'hit', createdAt: ts } as any);
    const arg = (EventModel.create as any).mock.calls[1][0];
    expect(arg.createdAt).toBe(ts);
  });
  it('upserts daily metric with proper filter', async () => {
    const repo = new MetricRepositoryMongo();
    (MetricDailyModel.updateOne as any).mockResolvedValueOnce(true);
    await repo.upsertDaily({ date: '2024-01-01', slug: 's', campaignId: 'c', views: 1 } as any);
    const [filter, doc, opts] = (MetricDailyModel.updateOne as any).mock.calls[0];
    expect(filter).toEqual({ date: '2024-01-01', slug: 's', campaignId: 'c' });
    expect(opts).toEqual({ upsert: true });
    expect(doc.views).toBe(1);
  });
});


