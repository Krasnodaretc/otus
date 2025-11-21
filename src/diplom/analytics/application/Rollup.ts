import { IEventRepository, IMetricRepository } from '../domain/IRepositories';

export interface RollupStrategy {
  execute(date: string): Promise<void>;
}

export class DailyRollup implements RollupStrategy {
  constructor(private readonly events: IEventRepository, private readonly metrics: IMetricRepository) {}
  async execute(date: string): Promise<void> {
    const rows = await this.events.aggregateByDate(date);
    const map = new Map<string, { clicks: number; redirects: number; matched: number; errors: number }>();
    const get = (slug: string) => {
      if (!map.has(slug)) map.set(slug, { clicks: 0, redirects: 0, matched: 0, errors: 0 });

      return map.get(slug)!;
    };

    for (const r of rows) {
      const b = get(r.slug || '');

      if (r.type === 'click') b.clicks += r.count;
      else if (r.type === 'redirect') b.redirects += r.count;
      else if (r.type === 'rule_matched') b.matched += r.count;
      else if (r.type === 'error') b.errors += r.count;
    }

    for (const [slug, m] of map.entries()) {
      await this.metrics.upsertDaily({ date, slug, metrics: m });
    }
  }
}


