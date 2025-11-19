export type ApiKeyInfo = {
  key: string;
  scopes?: string[];
  active?: boolean;
  tenantId?: string;
};

export interface IApiKeyReader {
  findActiveByKey(key: string): Promise<ApiKeyInfo | null>;
}


