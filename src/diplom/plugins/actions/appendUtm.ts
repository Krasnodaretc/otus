import { ActionPlugin } from '../../rules-engine/types';
import { readString, readStringArray } from '../utils';

const appendQuery = (url: string, params: Record<string, string>) => {
  if (!url) return '';

  const u = new URL(url);

  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));

  return u.toString();
};

export const appendUtmAction: ActionPlugin = {
  name: 'appendUtm',
  execute: (_ctx, params) => {
    let map: Record<string, string> = {};

    if (typeof params === 'object' && params !== null) {
      const v = (params as Record<string, unknown>)['map'];

      if (v && typeof v === 'object') {
        map = Object.fromEntries(
          Object.entries(v as Record<string, unknown>)
            .filter(([, val]) => typeof val === 'string')
            .map(([k, val]) => [k, String(val)])
        );
      }
    }

    const url = readString(params, 'url') || '';
    const final = appendQuery(url, map);

    return { type: 'transformUrl', url: final, meta: { map } };
  },
};


