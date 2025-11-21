import { CreateCampaignHandler, ListCampaignsHandler, CreateSmartLinkHandler, ListSmartLinksHandler, CreateVacancyHandler, ListVacanciesHandler, IssueApiKeyHandler, ListApiKeysHandler } from './UseCases';

const makeRepo = <T extends object>(impl: T): T => impl;

describe('Admin UseCases', () => {
  it('creates and lists campaigns', async () => {
    const created = { _id: '1', name: 'c1' };
    const repo = makeRepo({
      create: async (p: any) => ({ ...created, ...p }),
      list: async () => [created],
    });
    const create = new CreateCampaignHandler(repo as any);
    const list = new ListCampaignsHandler(repo as any);
    const res = await create.execute({ name: 'c1' });

    expect(res._id).toBe('1');
    const items = await list.execute();

    expect(items.length).toBe(1);
  });

  it('creates and lists smart links', async () => {
    const created = { _id: '1', slug: 's1' };
    const repo = makeRepo({
      create: async (p: any) => ({ ...created, ...p }),
      list: async () => [created],
    });
    const create = new CreateSmartLinkHandler(repo as any);
    const list = new ListSmartLinksHandler(repo as any);
    const res = await create.execute({ slug: 's1' });

    expect(res.slug).toBe('s1');
    const items = await list.execute();

    expect(items[0]._id).toBe('1');
  });

  it('creates and lists vacancies', async () => {
    const created = { _id: '1', title: 't', url: 'u' };
    const repo = makeRepo({
      create: async (p: any) => ({ ...created, ...p }),
      list: async () => [created],
    });
    const create = new CreateVacancyHandler(repo as any);
    const list = new ListVacanciesHandler(repo as any);
    const res = await create.execute({ title: 't', url: 'u' });

    expect(res.title).toBe('t');
    const items = await list.execute();

    expect(items.length).toBe(1);
  });

  it('issues and lists api keys', async () => {
    const created = { _id: '1', key: 'k1' };
    const repo = makeRepo({
      create: async (p: any) => ({ ...created, ...p }),
      list: async () => [created],
    });
    const issue = new IssueApiKeyHandler(repo as any);
    const list = new ListApiKeysHandler(repo as any);
    const res = await issue.execute({ key: 'k1' });

    expect(res.key).toBe('k1');
    const items = await list.execute();

    expect(items[0]._id).toBe('1');
  });
});


