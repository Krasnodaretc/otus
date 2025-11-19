import { Schema, InferSchemaType, model } from 'mongoose';

const RuleSetSchema = new Schema(
  {
    name: { type: String, required: true },
    tenantId: { type: String, index: true },
    dsl: { type: Schema.Types.Mixed, required: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

type RuleSet = InferSchemaType<typeof RuleSetSchema>;

RuleSetSchema.index({ name: 1, tenantId: 1 }, { unique: true, sparse: true });

export const RuleSetModel = model<RuleSet>('RuleSet', RuleSetSchema);


