export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'unknown';
export type ActionResultType = 'redirect' | 'transformUrl' | 'webhook' | 'deeplink';

export type Geo = {
  country?: string;
  region?: string;
  city?: string;
};

export type EvaluationContext = {
  ip?: string;
  userAgent?: string;
  locale?: string;
  skills?: string[];
  source?: string;
  referrer?: string;
  device?: DeviceType;
  os?: string;
  browser?: string;
  time?: Date;
  abBucket?: string;
  featureFlags?: Record<string, boolean>;
  geo?: Geo;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  slug?: string;
  campaignId?: string;
};

export type ActionExecutionResult = {
  type: ActionResultType;
  url?: string;
  payload?: unknown;
  meta?: Record<string, unknown>;
};


