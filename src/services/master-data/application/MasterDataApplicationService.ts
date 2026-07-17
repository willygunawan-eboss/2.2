import { IMasterDataRepository } from '../domain/IMasterDataRepository';
import { MasterDataFactory } from '../domain/MasterDataFactory';
import { MasterDataValidator } from './validation/MasterDataValidator';
import { CreateCurrencyDTO, CreateTaxDTO } from './DTOs';
import { MasterDataDomainError } from '../domain/errors/MasterDataDomainError';

export class MasterDataApplicationService {
  constructor(
    private repository: IMasterDataRepository,
    private factory: MasterDataFactory
  ) {}

  public async createCurrency(dto: CreateCurrencyDTO): Promise<string> {
    MasterDataValidator.validateCurrencyCreation(dto);
    const currency = this.factory.createCurrency(dto.code, dto.name, dto.symbol);
    await this.repository.saveCurrency(currency);
    return currency.id;
  }

  public async createTax(dto: CreateTaxDTO): Promise<string> {
    MasterDataValidator.validateTaxCreation(dto);
    const tax = this.factory.createTax(dto.code, dto.name, dto.rate);
    await this.repository.saveTax(tax);
    return tax.id;
  }

  public async generateNextNumber(seriesCode: string): Promise<string> {
    const series = await this.repository.getNumberSeriesByCode(seriesCode);
    if (!series) {
      throw new MasterDataDomainError(`Number series ${seriesCode} not found`);
    }
    const nextNumber = series.nextNumber();
    await this.repository.saveNumberSeries(series);
    return nextNumber;
  }
}
