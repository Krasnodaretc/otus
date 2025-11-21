import { registerAction, registerCondition } from '../rules-engine/registry';
import { ActionPlugin, ConditionPlugin } from '../rules-engine/types';

export type PluginKind = 'condition' | 'action';

export type PluginDescriptor = {
  name?: string;
  kind: PluginKind;
  version?: string;
};

export type LoadedPlugin = {
  kind: PluginKind;
  descriptor?: PluginDescriptor;
  plugin: ConditionPlugin | ActionPlugin;
};

export const isCondition = (p: unknown): p is ConditionPlugin =>
  typeof p === 'object' && p !== null && typeof (p as { match?: unknown }).match === 'function';
export const isAction = (p: unknown): p is ActionPlugin =>
  typeof p === 'object' && p !== null && typeof (p as { execute?: unknown }).execute === 'function';

export const registerDynamicPlugin = (loaded: LoadedPlugin) => {
  if (loaded.kind === 'condition') {
    if (!isCondition(loaded.plugin)) throw new Error('Invalid condition plugin');

    const plugin = loaded.plugin as ConditionPlugin;

    registerCondition(plugin);

    return;
  }

  if (!isAction(loaded.plugin)) throw new Error('Invalid action plugin');

  const plugin = loaded.plugin as ActionPlugin;

  registerAction(plugin);
};

export const loadPluginModule = async (modulePath: string): Promise<LoadedPlugin> => {
  // Expect module to export default or named { plugin, kind }
  // Dynamic import kept simple; callers decide how to use descriptor/version
   
  const mod = await import(modulePath);
  let candidate: unknown = (mod as Record<string, unknown>).default ?? (mod as Record<string, unknown>).plugin ?? mod;

  if (typeof candidate === 'object' && candidate !== null) {
    const maybeObj = candidate as Record<string, unknown>;

    if ('plugin' in maybeObj && maybeObj.plugin) {
      candidate = maybeObj.plugin;
    }
  }

  const modKind = (mod as Record<string, unknown>).kind;
  const kind: PluginKind =
    modKind === 'condition' || modKind === 'action'
      ? (modKind as PluginKind)
      : (isCondition(candidate) ? 'condition' : 'action');

  return { kind, plugin: candidate as ConditionPlugin | ActionPlugin };
};


