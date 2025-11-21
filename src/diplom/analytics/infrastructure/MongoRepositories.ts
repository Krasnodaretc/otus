import { EventModel, MetricDailyModel } from '../../db/schemas';
import { IEventRepository, IMetricRepository, EventRecord, MetricDailyRecord } from '../domain/IRepositories';

export class EventRepositoryMongo implements IEventRepository {
  async create(event: EventRecord): Promise<void> {
    await EventModel.create({
      ...event,
      createdAt: event.createdAt || new Date(),
    });
  }

  async aggregateByDate(date: string): Promise<Array<{ slug: string; type: string; count: number }>> {
    const start = new Date(date);
    const end = new Date(start.getTime() + 86400000);
    const rows: Array<{ _id: { slug?: string; type?: string }; count: number }> = await EventModel.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: { slug: '$slug', type: '$type' }, count: { $sum: 1 } } },
    ]);

    return rows.map((d) => ({ slug: d._id.slug || '', type: d._id.type || '', count: d.count || 0 }));
  }
}

export class MetricRepositoryMongo implements IMetricRepository {
  async upsertDaily(rec: MetricDailyRecord): Promise<void> {
    await MetricDailyModel.updateOne(
      { date: rec.date, slug: rec.slug, campaignId: rec.campaignId },
      rec,
      { upsert: true }
    );
  }
}


