jest.mock('../../db/schemas', () => {
  const camp = { _id: '1', name: 'c', tenantId: null, toObject() { return this; } };
  const sl = { _id: '2', slug: 's', enabled: true, toObject() { return this; } };
  const vac = { _id: '3', title: 't', url: 'u', active: true, toObject() { return this; } };
  const key = { _id: '4', key: 'k', active: true, scopes: [], toObject() { return this; } };

  return {
    CampaignModel: {
      create: async (p: any) => ({ ...camp, ...p, toObject() { return this; } }),
      find: () => ({ lean: async () => [camp] }),
    },
    SmartLinkModel: {
      create: async (p: any) => ({ ...sl, ...p, toObject() { return this; } }),
      find: () => ({ lean: async () => [sl] }),
      findOne: () => ({ lean: async () => sl }),
    },
    VacancyModel: {
      create: async (p: any) => ({ ...vac, ...p, toObject() { return this; } }),
      find: () => ({ lean: async () => [vac] }),
    },
    ApiKeyModel: {
      create: async (p: any) => ({ ...key, ...p, toObject() { return this; } }),
      find: () => ({ lean: async () => [key] }),
    },
  };
});

import { CampaignRepositoryMongo, SmartLinkRepositoryMongo, VacancyRepositoryMongo, ApiKeyRepositoryMongo } from './MongoRepositories';

describe('Admin MongoRepositories mapping', () => {
  it('campaign create/list', async () => {
    const repo = new CampaignRepositoryMongo();
    const c = await repo.create({ name: 'c' });

    expect(c._id).toBe('1');
    const items = await repo.list({});

    expect(items[0]._id).toBe('1');
  });
  it('smart link create/list/findBySlug', async () => {
    const repo = new SmartLinkRepositoryMongo();
    const s = await repo.create({ slug: 's' });

    expect(s.slug).toBe('s');
    const items = await repo.list({});

    expect(items[0]._id).toBe('2');
    const one = await repo.findBySlug('s');

    expect(one?.slug).toBe('s');
  });
  it('vacancy create/list', async () => {
    const repo = new VacancyRepositoryMongo();
    const v = await repo.create({ title: 't', url: 'u' });

    expect(v._id).toBe('3');
    const items = await repo.list({});

    expect(items[0].title).toBe('t');
  });
  it('apikey create/list', async () => {
    const repo = new ApiKeyRepositoryMongo();
    const a = await repo.create({ key: 'k' });

    expect(a._id).toBe('4');
    const items = await repo.list({});

    expect(items[0].key).toBe('k');
  });
});


