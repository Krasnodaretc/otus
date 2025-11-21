import { registerDynamicPlugin } from './loader';
import { registerCondition, registerAction, getCondition, getAction } from '../rules-engine/registry';

describe('plugin loader', () => {
  it('registers condition plugin', () => {
    const plugin = { name: 'testCond', match: () => true };

    registerDynamicPlugin({ kind: 'condition', plugin: plugin as any });
    expect(getCondition('testCond')).toBeDefined();
  });
  it('registers action plugin', () => {
    const plugin = { name: 'testAct', execute: () => ({ type: 'redirect', url: 'https://x' }) };

    registerDynamicPlugin({ kind: 'action', plugin: plugin as any });
    expect(getAction('testAct')).toBeDefined();
  });
});


