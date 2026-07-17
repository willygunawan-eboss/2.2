import { CreateCurrencyDTO, CreateTaxDTO } from '../DTOs';
import { MasterDataDomainError } from '../../domain/errors/MasterDataDomainError';

export class MasterDataValidator {
  static validateCurrencyCreation(dto: CreateCurrencyDTO): void {
    if (!dto.code) throw new MasterDataDomainError("Currency code is required");
    if (!dto.name) throw new MasterDataDomainError("Currency name is required");
  }

  static validateTaxCreation(dto: CreateTaxDTO): void {
    if (!dto.code) throw new MasterDataDomainError("Tax code is required");
    if (dto.rate < 0) throw new MasterDataDomainError("Tax rate cannot be negative");
  }
}
