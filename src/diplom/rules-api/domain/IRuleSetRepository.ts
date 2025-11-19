export type RuleSetRecord = {
  _id: string;
  name: string;
  tenantId?: string;
  dsl: any;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IRuleSetRepository {
  create(payload: Partial<RuleSetRecord>): Promise<RuleSetRecord>;
  findById(id: string): Promise<RuleSetRecord | null>;
  list(query?: Partial<RuleSetRecord>): Promise<RuleSetRecord[]>;
  update(id: string, patch: Partial<RuleSetRecord>): Promise<RuleSetRecord | null>;
  delete(id: string): Promise<void>;
}


