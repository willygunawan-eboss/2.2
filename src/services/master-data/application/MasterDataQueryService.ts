import { IMasterDataRepository } from '../domain/IMasterDataRepository';

export class MasterDataQueryService {
  constructor(private repository: IMasterDataRepository) {}

  public async getCurrency(id: string): Promise<Record<string, unknown> | null> {
    const currency = await this.repository.getCurrency(id);
    if (!currency) return null;
    return {
      id: currency.id,
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      isActive: currency.isActive
    };
  }
}
