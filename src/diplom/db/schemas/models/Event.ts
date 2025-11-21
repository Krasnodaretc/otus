import { Schema, InferSchemaType, model } from 'mongoose';

const EventSchema = new Schema(
  {
    type: { type: String, required: true, index: true },
    slug: { type: String, index: true },
    campaignId: { type: String, index: true },
    traceId: { type: String, index: true },
    payload: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: () => new Date(), expires: 60 * 60 * 24 * 14 },
  },
  { timestamps: false }
);

type Event = InferSchemaType<typeof EventSchema>;

EventSchema.index({ type: 1, createdAt: -1 });

export const EventModel = model<Event>('Event', EventSchema);


