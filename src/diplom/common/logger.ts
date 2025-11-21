type Level = 'debug' | 'info' | 'warn' | 'error';

const fmt = (level: Level, msg: string, meta?: unknown) => {
  const base = `[${new Date().toISOString()}] ${level.toUpperCase()} ${msg}`;

  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

export const logger = {
  debug: (msg: string, meta?: unknown) => console.debug(fmt('debug', msg, meta)),
  info: (msg: string, meta?: unknown) => console.info(fmt('info', msg, meta)),
  warn: (msg: string, meta?: unknown) => console.warn(fmt('warn', msg, meta)),
  error: (msg: string, meta?: unknown) => console.error(fmt('error', msg, meta)),
};


