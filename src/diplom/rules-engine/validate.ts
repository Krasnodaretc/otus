import { listActions, listConditions } from './registry';
import { RuleSetNode } from './types';

const validateCond = (node: unknown, allowed: Set<string>): string[] => {
  if (!node) return [];
  if (typeof node === 'object' && node !== null && 'all' in (node as Record<string, unknown>)) {
    const val = (node as { all?: unknown }).all;
    const arr = Array.isArray(val) ? val : [];
    return (arr as unknown[]).flatMap(n => validateCond(n, allowed));
  }
  if (typeof node === 'object' && node !== null && 'any' in (node as Record<string, unknown>)) {
    const val = (node as { any?: unknown }).any;
    const arr = Array.isArray(val) ? val : [];
    return (arr as unknown[]).flatMap(n => validateCond(n, allowed));
  }
  if (typeof node === 'object' && node !== null && 'type' in (node as Record<string, unknown>)) {
    const t = String((node as { type?: unknown }).type);
    if (!allowed.has(t)) return [`Unknown condition: ${t}`];
    return [];
  }
  return [];
};

const validateActions = (actions: unknown[], allowed: Set<string>): string[] => {
  const errors: string[] = [];
  for (const a of actions || []) {
    if (typeof a === 'object' && a !== null && 'type' in (a as Record<string, unknown>)) {
      const t = String((a as { type?: unknown }).type);
      if (!allowed.has(t)) errors.push(`Unknown action: ${t}`);
    }
  }
  return errors;
};

export const validateRuleSet = (rs: RuleSetNode) => {
  const condAllowed = new Set(listConditions());
  const actAllowed = new Set(listActions());
  const errors: string[] = [];
  for (const r of rs.rules || []) {
    errors.push(...validateCond(r.if, condAllowed));
    errors.push(...validateActions(r.then, actAllowed));
    errors.push(...validateActions(r.else || [], actAllowed));
  }
  return errors;
};


