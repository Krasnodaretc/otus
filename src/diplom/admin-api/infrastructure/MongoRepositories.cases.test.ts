jest.mock('../../db/schemas', () => {
  const mk = (o: Record<string, unknown>) => ({ ...o, toObject() { return this; } });
  return {
    CampaignModel: {
      create: async (p: any) => mk({ _id: 1, name: p.name, description: null, tenantId: undefined }),
      find: () => ({ lean: async () => [mk({ _id: 2, name: 'c2', description: undefined, tenantId: 't1' })] }),
    },
    SmartLinkModel: {
      create: async (p: any) => mk({ _id: 3, slug: p.slug, enabled: false, campaignId: null, ruleSetId: null, metadata: undefined }),
      find: () => ({ lean: async () => [mk({ _id: 4, slug: 's4', enabled: 0, campaignId: undefined, ruleSetId: undefined })] }),
      findOne: () => ({ lean: async () => null }),
    },
    VacancyModel: {
      create: async (p: any) => mk({ _id: 5, title: p.title, url: p.url, active: 0, campaignId: null, location: undefined, skills: 'bad', locale: null }),
      find: () => ({ lean: async () => [mk({ _id: 6, title: 't6', url: 'u6', active: 1, campaignId: '7', skills: ['a','b'] })] }),
    },
    ApiKeyModel: {
      create: async (p: any) => mk({ _id: 8, key: p.key, active: 0, scopes: 'bad', tenantId: null }),
      find: () => ({ lean: async () => [mk({ _id: 9, key: 'k9', active: 1, scopes: ['r'], tenantId: 't9' })] }),
    },
  };
});

import { CampaignRepositoryMongo, SmartLinkRepositoryMongo, VacancyRepositoryMongo, ApiKeyRepositoryMongo } from './MongoRepositories';

describe('Admin MongoRepositories mapping variants', () => {
  it('maps optional fields, disabled flags and arrays', async () => {
    const campRepo = new CampaignRepositoryMongo();
    const c = await campRepo.create({ name: 'c1' });
    expect(c.description).toBeUndefined();
    const cl = await campRepo.list();
    expect(cl[0].tenantId).toBe('t1');

    const slRepo = new SmartLinkRepositoryMongo();
    const s = await slRepo.create({ slug: 's3' });
    expect(s.enabled).toBe(false);
    expect(s.campaignId).toBeUndefined();
    expect(s.ruleSetId).toBeUndefined();
    const sList = await slRepo.list();
    expect(sList[0].enabled).toBe(false);
    const none = await slRepo.findBySlug('absent');
    expect(none).toBeNull();

    const vacRepo = new VacancyRepositoryMongo();
    const v = await vacRepo.create({ title: 't', url: 'u' });
    expect(v.active).toBe(false);
    expect(Array.isArray(v.skills)).toBe(true);

    const keyRepo = new ApiKeyRepositoryMongo();
    const a = await keyRepo.create({ key: 'k' });
    expect(a.active).toBe(false);
    expect(a.scopes).toEqual([]);
  });
});


