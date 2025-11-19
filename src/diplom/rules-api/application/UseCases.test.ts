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

  it('preview rules returns result', async () => {
    const preview = new PreviewRulesHandler();
    const res = await preview.execute({ skills: ['js'] }, { rules: [{ id: 'r', if: { any: [{ type: 'skill', hasAny: ['js'] }] }, then: [{ type: 'redirect', url: 'https://x' }] }] } as any);
    expect(res.matchedRuleId).toBe('r');
  });
});


