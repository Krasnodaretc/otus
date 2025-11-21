import { Schema, InferSchemaType, model } from 'mongoose';

const MetricDailySchema = new Schema(
  {
    date: { type: String, required: true, index: true },
    slug: { type: String, index: true },
    campaignId: { type: String, index: true },
    metrics: {
      clicks: { type: Number, default: 0 },
      redirects: { type: Number, default: 0 },
      matched: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

type MetricDaily = InferSchemaType<typeof MetricDailySchema>;

MetricDailySchema.index({ date: 1, slug: 1, campaignId: 1 }, { unique: true, sparse: true });

export const MetricDailyModel = model<MetricDaily>('MetricDaily', MetricDailySchema);


