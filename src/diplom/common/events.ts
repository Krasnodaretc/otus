export type EventRecord = {
  type: string;
  slug?: string;
  campaignId?: string;
  traceId?: string;
  payload?: unknown;
  createdAt?: Date;
};

export interface EventBus {
  publish: (event: EventRecord) => Promise<void>;
}

class ConsoleEventBus implements EventBus {
  async publish(event: EventRecord) {
    const rec = { ...event, createdAt: event.createdAt || new Date() };
    console.log('[event]', JSON.stringify(rec));
  }
}

export const eventBus: EventBus = new ConsoleEventBus();

export const createNatsEventBus = async (getConn: () => Promise<any>): Promise<EventBus> => {
  const conn = await getConn();
  return {
    publish: async (event) => {
      const subject = `events.${event.type}`;
      const data = JSON.stringify({ ...event, createdAt: event.createdAt || new Date().toISOString() });
      await conn.publish(subject, new TextEncoder().encode(data));
    },
  };
};


