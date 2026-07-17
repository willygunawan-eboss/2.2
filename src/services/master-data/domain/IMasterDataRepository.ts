import { Currency } from './Currency';
import { ExchangeRate } from './ExchangeRate';
import { FiscalCalendar } from './FiscalCalendar';
import { Tax } from './Tax';
import { UnitOfMeasure } from './UnitOfMeasure';
import { NumberSeries } from './NumberSeries';
import { CostCenter } from './CostCenter';
import { ProfitCenter } from './ProfitCenter';

export interface IMasterDataRepository {
  saveCurrency(currency: Currency): Promise<void>;
  getCurrency(id: string): Promise<Currency | null>;
  
  saveExchangeRate(rate: ExchangeRate): Promise<void>;
  saveFiscalCalendar(calendar: FiscalCalendar): Promise<void>;
  getFiscalCalendar(id: string): Promise<FiscalCalendar | null>;
  saveTax(tax: Tax): Promise<void>;
  saveUnitOfMeasure(uom: UnitOfMeasure): Promise<void>;
  
  saveNumberSeries(series: NumberSeries): Promise<void>;
  getNumberSeriesByCode(code: string): Promise<NumberSeries | null>;
  
  saveCostCenter(costCenter: CostCenter): Promise<void>;
  saveProfitCenter(profitCenter: ProfitCenter): Promise<void>;
}
