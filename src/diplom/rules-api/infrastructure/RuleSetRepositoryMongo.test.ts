jest.mock('../../db/schemas', () => {
  const doc = { _id: '1', name: 'rs', version: 1, dsl: {}, createdAt: new Date(), updatedAt: new Date(), toObject() { return this; } };

  return {
    RuleSetModel: {
      create: async (p: any) => ({ ...doc, ...p, toObject() { return this; } }),
      findById: () => ({ lean: async () => doc }),
      find: () => ({ lean: async () => [doc] }),
      findByIdAndUpdate: () => ({ lean: async () => ({ ...doc, name: 'rs2', version: 2 }) }),
      findByIdAndDelete: async () => {},
    },
  };
});

import { RuleSetRepositoryMongo } from './RuleSetRepositoryMongo';

describe('RuleSetRepositoryMongo mapping', () => {
  it('create/find/list/update/delete', async () => {
    const repo = new RuleSetRepositoryMongo();
    const c = await repo.create({ name: 'rs', dsl: {}, version: 1 });

    expect(c._id).toBe('1');
    const f = await repo.findById('1');

    expect(f?.name).toBe('rs');
    const list = await repo.list();

    expect(list.length).toBe(1);
    const u = await repo.update('1', { name: 'rs2', version: 2 });

    expect(u?.name).toBe('rs2');
    await repo.delete('1');
  });
});


