export type EventRecord = {
  type: string;
  slug?: string;
  campaignId?: string;
  traceId?: string;
  payload?: unknown;
  createdAt?: Date;
};

export type MetricDailyRecord = {
  date: string;
  slug?: string;
  campaignId?: string;
  metrics: {
    clicks: number;
    redirects: number;
    matched: number;
    errors: number;
  };
};

export interface IEventRepository {
  create(event: EventRecord): Promise<void>;
  aggregateByDate(date: string): Promise<Array<{ slug: string; type: string; count: number }>>;
}

export interface IMetricRepository {
  upsertDaily(rec: MetricDailyRecord): Promise<void>;
}


