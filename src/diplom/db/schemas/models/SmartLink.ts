import { Schema, InferSchemaType, model } from 'mongoose';

const SmartLinkSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', index: true },
    ruleSetId: { type: Schema.Types.ObjectId, ref: 'RuleSet', index: true },
    enabled: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

type SmartLink = InferSchemaType<typeof SmartLinkSchema>;

export const SmartLinkModel = model<SmartLink>('SmartLink', SmartLinkSchema);


