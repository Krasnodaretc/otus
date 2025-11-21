import { ActionPlugin } from '../../rules-engine/types';
import { readString } from '../utils';

export const webhookAction: ActionPlugin = {
  name: 'webhook',
  execute: (_ctx, params) => {
    const url = readString(params, 'url') || '';
    const payload = typeof params === 'object' && params !== null ? (params as Record<string, unknown>)['payload'] : undefined;

    return { type: 'webhook', url, payload };
  },
};


