export type CampaignRecord = { _id: string; name: string; description?: string; tenantId?: string };
export type SmartLinkRecord = { _id: string; slug: string; campaignId?: string; ruleSetId?: string; enabled?: boolean; metadata?: any };
export type VacancyRecord = { _id: string; title: string; url: string; campaignId?: string; location?: string; skills?: string[]; locale?: string; active?: boolean };
export type ApiKeyRecord = { _id: string; key: string; tenantId?: string; scopes?: string[]; active?: boolean };

export interface ICampaignRepository {
  create(payload: Partial<CampaignRecord>): Promise<CampaignRecord>;
  list(query?: Partial<CampaignRecord>): Promise<CampaignRecord[]>;
}

export interface ISmartLinkRepository {
  create(payload: Partial<SmartLinkRecord>): Promise<SmartLinkRecord>;
  list(query?: Partial<SmartLinkRecord>): Promise<SmartLinkRecord[]>;
  findBySlug(slug: string): Promise<SmartLinkRecord | null>;
}

export interface IVacancyRepository {
  create(payload: Partial<VacancyRecord>): Promise<VacancyRecord>;
  list(query?: Partial<VacancyRecord>): Promise<VacancyRecord[]>;
}

export interface IApiKeyRepository {
  create(payload: Partial<ApiKeyRecord>): Promise<ApiKeyRecord>;
  list(query?: Partial<ApiKeyRecord>): Promise<ApiKeyRecord[]>;
}


