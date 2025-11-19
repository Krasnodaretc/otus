import { Schema, InferSchemaType, model } from 'mongoose';

const VacancySchema = new Schema(
  {
    title: { type: String, required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', index: true },
    location: { type: String },
    skills: { type: [String], index: true },
    url: { type: String, required: true },
    locale: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

type Vacancy = InferSchemaType<typeof VacancySchema>;

VacancySchema.index({ title: 1, campaignId: 1 });

export const VacancyModel = model<Vacancy>('Vacancy', VacancySchema);


