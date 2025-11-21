import { CreateRuleSetHandler, DeleteRuleSetHandler, GetRuleSetHandler, ListRuleSetsHandler, PreviewRulesHandler, UpdateRuleSetHandler } from './UseCases';
import { registerBuiltInPlugins } from '../../plugins/register';

const repo = {
  create: async (p: any) => ({ _id: '1', name: 'rs', version: 1, dsl: p.dsl }),
  findById: async (id: string) => ({ _id: id, name: 'rs', version: 1, dsl: { rules: [] } }),
  list: async () => [{ _id: '1', name: 'rs', version: 1, dsl: { rules: [] } }],
  update: async (_: string, patch: any) => ({ _id: '1', name: patch?.name || 'rs', version: patch?.version || 1, dsl: patch?.dsl || { rules: [] } }),
  delete: async () => {},
};

describe('Rules UseCases', () => {
  beforeAll(() => {
    registerBuiltInPlugins();
  });
  it('create/find/list/update/delete', async () => {
    const create = new CreateRuleSetHandler(repo as any);
    const get = new GetRuleSetHandler(repo as any);
    const list = new ListRuleSetsHandler(repo as any);
    const update = new UpdateRuleSetHandler(repo as any);
    const del = new DeleteRuleSetHandler(repo as any);
    const c = await create.execute({ dsl: { rules: [] } });

    expect(c._id).toBe('1');
    const g = await get.execute('1');

    expect(g?.name).toBe('rs');
    const l = await list.execute();

    expect(l.length).toBe(1);
    const u = await update.execute('1', { name: 'rs2', version: 2, dsl: { rules: [] } });

    expect(u?.name).toBe('rs2');
    await del.execute('1');
  });

  it('create fails without dsl and with invalid dsl', async () => {
    const create = new CreateRuleSetHandler(repo as any);

    await expect(create.execute({})).rejects.toThrow(/dsl required/);
    await expect(create.execute({ dsl: { rules: [{ id: 'x', if: { any: [{ type: 'unknown' }] }, then: [] }] } as any })).rejects.toThrow();
  });

  it('update validates dsl when present and skips when absent', async () => {
    const update = new UpdateRuleSetHandler(repo as any);

    // invalid dsl present -> throws
    await expect(update.execute('1', { dsl: { rules: [{ id: 'x', if: { any: [{ type: 'unknown' }] }, then: [] }] } as any })).rejects.toThrow();
    // no dsl present -> passes to repo
    const res = await update.execute('1', { name: 'ok' });

    expect(res?.name).toBe('ok');
  });

  it('preview rules returns result', async () => {
    const preview = new PreviewRulesHandler();
    const res = await preview.execute({ skills: ['js'] }, { rules: [{ id: 'r', if: { any: [{ type: 'skill', hasAny: ['js'] }] }, then: [{ type: 'redirect', url: 'https://x' }] }] } as any);

    expect(res.matchedRuleId).toBe('r');
  });

  it('preview rules fails on invalid dsl', async () => {
    const preview = new PreviewRulesHandler();

    await expect(preview.execute({}, { rules: [{ id: 'x', if: { any: [{ type: 'unknown' }] }, then: [] }] } as any)).rejects.toThrow();
  });
});


