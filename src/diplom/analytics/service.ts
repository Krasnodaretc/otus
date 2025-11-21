import { EventDispatcher } from './domain/EventDispatcher';
import { PersistAllHandler } from './application/handlers/CoreHandlers';
import { DailyRollup, RollupStrategy } from './application/Rollup';
import { EventRecord, IEventRepository, IMetricRepository } from './domain/IRepositories';
import { withMeasurement } from '../common/observability';

export class AnalyticsService {
  private readonly events: IEventRepository;
  private readonly metrics: IMetricRepository;
  private readonly dispatcher: EventDispatcher;
  private readonly rollupStrategy: RollupStrategy;

  constructor(events: IEventRepository, metrics: IMetricRepository) {
    this.events = events;
    this.metrics = metrics;
    this.dispatcher = new EventDispatcher();
    this.dispatcher.register(new PersistAllHandler(this.events));
    this.rollupStrategy = new DailyRollup(this.events, this.metrics);
  }

  readonly ingestEvent = withMeasurement(async (evt: EventRecord) => {
    await this.dispatcher.dispatch(evt);
    return { ok: true };
  }, 'analytics.ingest');

  readonly rollupDaily = withMeasurement(async (date: string) => {
    await this.rollupStrategy.execute(date);
    return { ok: true };
  }, 'analytics.rollup_daily');
}
