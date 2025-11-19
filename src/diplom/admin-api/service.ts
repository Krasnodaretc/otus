import { CampaignRepositoryMongo, SmartLinkRepositoryMongo, VacancyRepositoryMongo, ApiKeyRepositoryMongo } from './infrastructure/MongoRepositories';
import { CreateCampaignHandler, CreateSmartLinkHandler, CreateVacancyHandler, IssueApiKeyHandler, ListApiKeysHandler, ListCampaignsHandler, ListSmartLinksHandler, ListVacanciesHandler } from './application/UseCases';
import { ApiKeyRecord, CampaignRecord, SmartLinkRecord, VacancyRecord } from './domain/IRepositories';

export const createCampaign = async (payload: Partial<CampaignRecord>) => new CreateCampaignHandler(new CampaignRepositoryMongo()).execute(payload);
export const listCampaigns = async (query: Partial<CampaignRecord> = {}) => new ListCampaignsHandler(new CampaignRepositoryMongo()).execute(query);

export const createSmartLink = async (payload: Partial<SmartLinkRecord>) => new CreateSmartLinkHandler(new SmartLinkRepositoryMongo()).execute(payload);
export const getSmartLink = async (slug: string) => new SmartLinkRepositoryMongo().findBySlug(slug);
export const listSmartLinks = async (query: Partial<SmartLinkRecord> = {}) => new ListSmartLinksHandler(new SmartLinkRepositoryMongo()).execute(query);

export const createVacancy = async (payload: Partial<VacancyRecord>) => new CreateVacancyHandler(new VacancyRepositoryMongo()).execute(payload);
export const listVacancies = async (query: Partial<VacancyRecord> = {}) => new ListVacanciesHandler(new VacancyRepositoryMongo()).execute(query);

export const issueApiKey = async (payload: Partial<ApiKeyRecord>) => new IssueApiKeyHandler(new ApiKeyRepositoryMongo()).execute(payload);
export const listApiKeys = async (query: Partial<ApiKeyRecord> = {}) => new ListApiKeysHandler(new ApiKeyRepositoryMongo()).execute(query);


