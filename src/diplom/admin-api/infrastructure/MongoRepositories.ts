import { ApiKeyModel, CampaignModel, SmartLinkModel, VacancyModel } from '../../db/schemas';
import { IApiKeyRepository, ICampaignRepository, ISmartLinkRepository, IVacancyRepository, ApiKeyRecord, CampaignRecord, SmartLinkRecord, VacancyRecord } from '../domain/IRepositories';

const mapCampaign = (doc: any): CampaignRecord => ({
  _id: String(doc._id),
  name: doc.name,
  description: doc.description ?? undefined,
  tenantId: doc.tenantId ?? undefined,
});
const mapSmartLink = (doc: any): SmartLinkRecord => ({
  _id: String(doc._id),
  slug: doc.slug,
  enabled: Boolean(doc.enabled),
  campaignId: doc.campaignId ? String(doc.campaignId) : undefined,
  ruleSetId: doc.ruleSetId ? String(doc.ruleSetId) : undefined,
  metadata: doc.metadata,
});
const mapVacancy = (doc: any): VacancyRecord => ({
  _id: String(doc._id),
  title: doc.title,
  url: doc.url,
  active: Boolean(doc.active),
  campaignId: doc.campaignId ? String(doc.campaignId) : undefined,
  location: doc.location ?? undefined,
  skills: Array.isArray(doc.skills) ? doc.skills : [],
  locale: doc.locale ?? undefined,
});
const mapApiKey = (doc: any): ApiKeyRecord => ({
  _id: String(doc._id),
  key: doc.key,
  active: Boolean(doc.active),
  scopes: Array.isArray(doc.scopes) ? doc.scopes : [],
  tenantId: doc.tenantId ?? undefined,
});

export class CampaignRepositoryMongo implements ICampaignRepository {
  async create(payload: Partial<CampaignRecord>): Promise<CampaignRecord> {
    const doc = await CampaignModel.create(payload);
    return mapCampaign(doc.toObject());
  }
  async list(query?: Partial<CampaignRecord>): Promise<CampaignRecord[]> {
    const rows = await CampaignModel.find(query || {}).lean();
    return rows.map(mapCampaign);
  }
}

export class SmartLinkRepositoryMongo implements ISmartLinkRepository {
  async create(payload: Partial<SmartLinkRecord>): Promise<SmartLinkRecord> {
    const doc = await SmartLinkModel.create(payload);
    return mapSmartLink(doc.toObject());
  }
  async list(query?: Partial<SmartLinkRecord>): Promise<SmartLinkRecord[]> {
    const rows = await SmartLinkModel.find(query || {}).lean();
    return rows.map(mapSmartLink);
  }
  async findBySlug(slug: string): Promise<SmartLinkRecord | null> {
    const doc = await SmartLinkModel.findOne({ slug }).lean();
    return doc ? mapSmartLink(doc) : null;
  }
}

export class VacancyRepositoryMongo implements IVacancyRepository {
  async create(payload: Partial<VacancyRecord>): Promise<VacancyRecord> {
    const doc = await VacancyModel.create(payload);
    return mapVacancy(doc.toObject());
  }
  async list(query?: Partial<VacancyRecord>): Promise<VacancyRecord[]> {
    const rows = await VacancyModel.find(query || {}).lean();
    return rows.map(mapVacancy);
  }
}

export class ApiKeyRepositoryMongo implements IApiKeyRepository {
  async create(payload: Partial<ApiKeyRecord>): Promise<ApiKeyRecord> {
    const doc = await ApiKeyModel.create(payload);
    return mapApiKey(doc.toObject());
  }
  async list(query?: Partial<ApiKeyRecord>): Promise<ApiKeyRecord[]> {
    const rows = await ApiKeyModel.find(query || {}).lean();
    return rows.map(mapApiKey);
  }
}


