import { ApiKeyReaderMongo } from './ApiKeyReaderMongo';
import { ApiKeyModel } from '../../db/schemas';

jest.mock('../../db/schemas', () => ({
  ApiKeyModel: {
    findOne: jest.fn(),
  },
}));

describe('ApiKeyReaderMongo', () => {
  it('returns null when not found', async () => {
    (ApiKeyModel.findOne as any).mockReturnValueOnce({ lean: jest.fn().mockResolvedValueOnce(null) });
    const reader = new ApiKeyReaderMongo();
    const rec = await reader.findActiveByKey('k');

    expect(rec).toBeNull();
  });
  it('returns record with normalized scopes', async () => {
    (ApiKeyModel.findOne as any).mockReturnValueOnce({ lean: jest.fn().mockResolvedValueOnce({ key: 'k', active: true, scopes: ['read'], tenantId: 't1' }) });
    const reader = new ApiKeyReaderMongo();
    const rec = await reader.findActiveByKey('k');

    expect(rec?.key).toBe('k');
    expect(rec?.scopes).toEqual(['read']);
    expect(rec?.tenantId).toBe('t1');
  });
  it('handles bad scopes type', async () => {
    (ApiKeyModel.findOne as any).mockReturnValueOnce({ lean: jest.fn().mockResolvedValueOnce({ key: 'k', active: true, scopes: 'read' }) });
    const reader = new ApiKeyReaderMongo();
    const rec = await reader.findActiveByKey('k');

    expect(rec?.scopes).toEqual([]);
  });
});


