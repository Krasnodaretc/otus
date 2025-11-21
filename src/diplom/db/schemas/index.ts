import mongoose from 'mongoose';

export const connectMongo = async (mongoUrl: string) => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(mongoUrl);

  return mongoose.connection;
};

export { CampaignModel } from './models/Campaign';
export { SmartLinkModel } from './models/SmartLink';
export { RuleSetModel } from './models/RuleSet';
export { VacancyModel } from './models/Vacancy';
export { ApiKeyModel } from './models/ApiKey';
export { EventModel } from './models/Event';
export { MetricDailyModel } from './models/MetricDaily';


