import mongoose, { Schema, InferSchemaType, model } from 'mongoose';

const CampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    tenantId: { type: String, index: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

type Campaign = InferSchemaType<typeof CampaignSchema>;

CampaignSchema.index({ name: 1, tenantId: 1 }, { unique: true, sparse: true });

export const CampaignModel = model<Campaign>('Campaign', CampaignSchema);


