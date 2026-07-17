import { IMasterDataRepository } from '../domain/IMasterDataRepository';
import { Currency } from '../domain/Currency';
import { ExchangeRate } from '../domain/ExchangeRate';
import { FiscalCalendar } from '../domain/FiscalCalendar';
import { Tax } from '../domain/Tax';
import { UnitOfMeasure } from '../domain/UnitOfMeasure';
import { NumberSeries } from '../domain/NumberSeries';
import { CostCenter } from '../domain/CostCenter';
import { ProfitCenter } from '../domain/ProfitCenter';

// Mock repository implementation for architecture validation
export class MasterDataRepository implements IMasterDataRepository {
  private currencies: Map<string, Currency> = new Map();
  private calendars: Map<string, FiscalCalendar> = new Map();
  private numberSeries: Map<string, NumberSeries> = new Map();

  async saveCurrency(currency: Currency): Promise<void> {
    this.currencies.set(currency.id, currency);
  }

  async getCurrency(id: string): Promise<Currency | null> {
    return this.currencies.get(id) || null;
  }

  async saveExchangeRate(rate: ExchangeRate): Promise<void> {}
  async saveFiscalCalendar(calendar: FiscalCalendar): Promise<void> { this.calendars.set(calendar.id, calendar); }
  async getFiscalCalendar(id: string): Promise<FiscalCalendar | null> { return this.calendars.get(id) || null; }
  async saveTax(tax: Tax): Promise<void> {}
  async saveUnitOfMeasure(uom: UnitOfMeasure): Promise<void> {}

  async saveNumberSeries(series: NumberSeries): Promise<void> {
    this.numberSeries.set(series.code, series);
  }

  async getNumberSeriesByCode(code: string): Promise<NumberSeries | null> {
    return this.numberSeries.get(code) || null;
  }

  async saveCostCenter(costCenter: CostCenter): Promise<void> {}
  async saveProfitCenter(profitCenter: ProfitCenter): Promise<void> {}
}
