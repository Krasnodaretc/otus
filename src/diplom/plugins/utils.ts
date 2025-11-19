export const readString = (obj: unknown, key: string): string | undefined => {
  if (typeof obj === 'object' && obj !== null) {
    const v = (obj as Record<string, unknown>)[key];
    if (typeof v === 'string') return v;
  }
  return undefined;
};

export const readStringArray = (obj: unknown, key: string): string[] => {
  if (typeof obj === 'object' && obj !== null) {
    const v = (obj as Record<string, unknown>)[key];
    if (Array.isArray(v)) {
      return v.filter((x): x is string => typeof x === 'string');
    }
  }
  return [];
};

export const readNumber = (obj: unknown, key: string): number | undefined => {
  if (typeof obj === 'object' && obj !== null) {
    const v = (obj as Record<string, unknown>)[key];
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  }
  return undefined;
};


