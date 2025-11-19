import { ActionPlugin } from '../../rules-engine/types';
import { readString } from '../utils';

export const redirectAction: ActionPlugin = {
  name: 'redirect',
  execute: (_ctx, params) => {
    const url = readString(params, 'url') || '';
    return { type: 'redirect', url };
  },
};


