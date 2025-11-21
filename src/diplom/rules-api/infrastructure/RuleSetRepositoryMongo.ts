import { IRuleSetRepository, RuleSetRecord } from '../domain/IRuleSetRepository';
import { RuleSetModel } from '../../db/schemas';

const mapRecord = (doc: any): RuleSetRecord => ({
  _id: String(doc._id),
  name: doc.name,
  tenantId: doc.tenantId ?? undefined,
  dsl: doc.dsl,
  version: doc.version,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class RuleSetRepositoryMongo implements IRuleSetRepository {
  async create(payload: Partial<RuleSetRecord>): Promise<RuleSetRecord> {
    const doc = await RuleSetModel.create(payload);

    return mapRecord(doc.toObject());
  }

  async findById(id: string): Promise<RuleSetRecord | null> {
    const doc = await RuleSetModel.findById(id).lean();

    return doc ? mapRecord(doc) : null;
  }

  async list(query?: Partial<RuleSetRecord>): Promise<RuleSetRecord[]> {
    const rows = await RuleSetModel.find(query || {}).lean();

    return rows.map(mapRecord);
  }

  async update(id: string, patch: Partial<RuleSetRecord>): Promise<RuleSetRecord | null> {
    const doc = await RuleSetModel.findByIdAndUpdate(id, patch, { new: true }).lean();

    return doc ? mapRecord(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await RuleSetModel.findByIdAndDelete(id);
  }
}


