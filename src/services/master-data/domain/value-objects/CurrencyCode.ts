import { MasterDataDomainError } from '../errors/MasterDataDomainError';

export class CurrencyCode {
  constructor(public readonly value: string) {
    if (!value || value.length !== 3) {
      throw new MasterDataDomainError("Currency code must be exactly 3 characters.");
    }
    this.value = value.toUpperCase();
  }
}
