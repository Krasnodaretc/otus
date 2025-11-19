import { registerDynamicPlugin } from './loader';

describe('plugin loader negative', () => {
  it('throws on invalid condition plugin', () => {
    expect(() => registerDynamicPlugin({ kind: 'condition', plugin: { name: 'bad' } as any })).toThrow();
  });
  it('throws on invalid action plugin', () => {
    expect(() => registerDynamicPlugin({ kind: 'action', plugin: { name: 'bad' } as any })).toThrow();
  });
});


