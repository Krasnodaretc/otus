import { Schema, InferSchemaType, model } from 'mongoose';

const ApiKeySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, index: true },
    scopes: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

type ApiKey = InferSchemaType<typeof ApiKeySchema>;

export const ApiKeyModel = model<ApiKey>('ApiKey', ApiKeySchema);


