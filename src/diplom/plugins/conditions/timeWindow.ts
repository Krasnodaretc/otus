import { ConditionPlugin } from '../../rules-engine/types';
import { readString } from '../utils';

const parseTime = (s: string) => {
  const m = /^(\d{2}):(\d{2})([+-]\d{2}):?(\d{2})?$/.exec(s);

  if (!m) return null;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const offH = Number(m[3]);
  const offM = Number(m[4] || '0');
  const offsetMin = offH * 60 + Math.sign(offH) * offM;

  return { hh, mm, offsetMin };
};

const minutesInTz = (d: Date, offsetMin: number) => {
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const local = new Date(utc + offsetMin * 60000);

  return local.getHours() * 60 + local.getMinutes();
};

export const timeWindowCondition: ConditionPlugin = {
  name: 'timeWindow',
  match: (_ctx, params) => {
    const from = parseTime(readString(params, 'from') || '00:00+00:00');
    const to = parseTime(readString(params, 'to') || '23:59+00:00');

    if (!from || !to) return false;

    const now = new Date();
    const nowMin = minutesInTz(now, from.offsetMin);
    const fromMin = from.hh * 60 + from.mm;
    const toMin = to.hh * 60 + to.mm;

    if (toMin >= fromMin) return nowMin >= fromMin && nowMin <= toMin;

    return nowMin >= fromMin || nowMin <= toMin;
  },
};


