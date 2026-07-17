import { Currency } from '../domain/Currency';
import { CurrencyCode } from '../domain/value-objects/CurrencyCode';

export class MasterDataMapper {
  static toDomainCurrency(raw: any): Currency {
    return new Currency({
      id: raw.id,
      code: new CurrencyCode(raw.code),
      name: raw.name,
      symbol: raw.symbol,
      isActive: raw.is_active || raw.isActive
    });
  }

  static toPersistenceCurrency(domain: Currency): any {
    return {
      id: domain.id,
      code: domain.code,
      name: domain.name,
      symbol: domain.symbol,
      is_active: domain.isActive
    };
  }
}
