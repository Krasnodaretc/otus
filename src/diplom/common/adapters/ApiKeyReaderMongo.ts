import { IApiKeyReader, ApiKeyInfo } from '../ports/IApiKeyReader';
import { ApiKeyModel } from '../../db/schemas';

export class ApiKeyReaderMongo implements IApiKeyReader {
  async findActiveByKey(key: string): Promise<ApiKeyInfo | null> {
    const rec = await ApiKeyModel.findOne({ key, active: true }).lean();
    if (!rec) return null;
    return {
      key: rec.key,
      scopes: Array.isArray((rec as any).scopes) ? ((rec as any).scopes as string[]) : [],
      active: rec.active,
      tenantId: rec.tenantId ?? undefined,
    };
  }
}


