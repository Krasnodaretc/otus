import { CampaignRepositoryMongo, SmartLinkRepositoryMongo, VacancyRepositoryMongo, ApiKeyRepositoryMongo } from './infrastructure/MongoRepositories';
import { CreateCampaignHandler, CreateSmartLinkHandler, CreateVacancyHandler, IssueApiKeyHandler, ListApiKeysHandler, ListCampaignsHandler, ListSmartLinksHandler, ListVacanciesHandler } from './application/UseCases';
import { ApiKeyRecord, CampaignRecord, SmartLinkRecord, VacancyRecord } from './domain/IRepositories';
import { globalContainer } from '../common/ioc';

const getCampaignRepo = () => {
  try { return globalContainer.resolve<CampaignRepositoryMongo>('repo.Campaign'); } catch { return new CampaignRepositoryMongo(); }
};
const getSmartLinkRepo = () => {
  try { return globalContainer.resolve<SmartLinkRepositoryMongo>('repo.SmartLink'); } catch { return new SmartLinkRepositoryMongo(); }
};
const getVacancyRepo = () => {
  try { return globalContainer.resolve<VacancyRepositoryMongo>('repo.Vacancy'); } catch { return new VacancyRepositoryMongo(); }
};
const getApiKeyRepo = () => {
  try { return globalContainer.resolve<ApiKeyRepositoryMongo>('repo.ApiKey'); } catch { return new ApiKeyRepositoryMongo(); }
};

export const createCampaign = async (payload: Partial<CampaignRecord>) => new CreateCampaignHandler(getCampaignRepo()).execute(payload);
export const listCampaigns = async (query: Partial<CampaignRecord> = {}) => new ListCampaignsHandler(getCampaignRepo()).execute(query);

export const createSmartLink = async (payload: Partial<SmartLinkRecord>) => new CreateSmartLinkHandler(getSmartLinkRepo()).execute(payload);
export const getSmartLink = async (slug: string) => getSmartLinkRepo().findBySlug(slug);
export const listSmartLinks = async (query: Partial<SmartLinkRecord> = {}) => new ListSmartLinksHandler(getSmartLinkRepo()).execute(query);

export const createVacancy = async (payload: Partial<VacancyRecord>) => new CreateVacancyHandler(getVacancyRepo()).execute(payload);
export const listVacancies = async (query: Partial<VacancyRecord> = {}) => new ListVacanciesHandler(getVacancyRepo()).execute(query);

export const issueApiKey = async (payload: Partial<ApiKeyRecord>) => new IssueApiKeyHandler(getApiKeyRepo()).execute(payload);
export const listApiKeys = async (query: Partial<ApiKeyRecord> = {}) => new ListApiKeysHandler(getApiKeyRepo()).execute(query);

