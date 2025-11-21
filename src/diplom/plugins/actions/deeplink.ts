import { ActionPlugin } from '../../rules-engine/types';
import { readString } from '../utils';

export const deeplinkAction: ActionPlugin = {
  name: 'deeplink',
  execute: (_ctx, params) => {
    const url = readString(params, 'url') || '';

    return { type: 'deeplink', url };
  },
};


