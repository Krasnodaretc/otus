import { loadPluginModule } from './loader';

jest.mock('virtual-cond', () => ({
  kind: 'condition',
  plugin: { name: 'vcond', match: () => true },
}), { virtual: true });

jest.mock('virtual-act', () => ({
  plugin: { name: 'vact', execute: () => ({ type: 'redirect', url: '' }) },
}), { virtual: true });

jest.mock('virtual-nested', () => ({
  default: { plugin: { name: 'vn', match: () => true } },
  plugin: { name: 'vn', match: () => true },
}), { virtual: true });

describe('loadPluginModule', () => {
  it('loads condition with explicit kind', async () => {
    const lp = await loadPluginModule('virtual-cond' as any);

    expect(lp.kind).toBe('condition');
    expect(typeof (lp.plugin as any).match).toBe('function');
  });
  it('loads action and infers kind', async () => {
    const lp = await loadPluginModule('virtual-act' as any);

    expect(lp.kind).toBe('action');
    expect(typeof (lp.plugin as any).execute).toBe('function');
  });
  it('loads condition from default.plugin wrapper', async () => {
    const lp = await loadPluginModule('virtual-nested' as any);

    expect(typeof (lp.plugin as any).match).toBe('function');
  });
});


