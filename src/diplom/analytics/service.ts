import { EventRepositoryMongo, MetricRepositoryMongo } from './infrastructure/MongoRepositories';
import { EventDispatcher } from './domain/EventDispatcher';
import { PersistAllHandler } from './application/handlers/CoreHandlers';
import { DailyRollup } from './application/Rollup';
import { EventRecord } from './domain/IRepositories';
import { withMeasurement } from '../common/observability';

export const ingestEvent = withMeasurement(async (evt: EventRecord) => {
  const events = new EventRepositoryMongo();
  const dispatcher = new EventDispatcher();
  dispatcher.register(new PersistAllHandler(events));
  await dispatcher.dispatch(evt);
  return { ok: true };
}, 'analytics.ingest');

export const rollupDaily = withMeasurement(async (date: string) => {
  const events = new EventRepositoryMongo();
  const metrics = new MetricRepositoryMongo();
  const strategy = new DailyRollup(events, metrics);
  await strategy.execute(date);
  return { ok: true };
}, 'analytics.rollup_daily');

