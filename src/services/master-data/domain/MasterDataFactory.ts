import { Currency, CurrencyProps } from './Currency';
import { CurrencyCode } from './value-objects/CurrencyCode';
import { ExchangeRate, ExchangeRateProps } from './ExchangeRate';
import { FiscalCalendar, FiscalCalendarProps } from './FiscalCalendar';
import { Tax, TaxProps } from './Tax';
import { UnitOfMeasure, UnitOfMeasureProps } from './UnitOfMeasure';
import { NumberSeries, NumberSeriesProps } from './NumberSeries';
import { CostCenter, CostCenterProps } from './CostCenter';
import { ProfitCenter, ProfitCenterProps } from './ProfitCenter';
import { v4 as uuidv4 } from 'uuid';

export class MasterDataFactory {
  createCurrency(code: string, name: string, symbol: string): Currency {
    return new Currency({
      id: uuidv4(),
      code: new CurrencyCode(code),
      name,
      symbol,
      isActive: true
    });
  }

  createExchangeRate(baseCurrencyId: string, targetCurrencyId: string, rate: number, effectiveDate: Date): ExchangeRate {
    return new ExchangeRate({
      id: uuidv4(),
      baseCurrencyId,
      targetCurrencyId,
      rate,
      effectiveDate
    });
  }

  createTax(code: string, name: string, rate: number): Tax {
    return new Tax({
      id: uuidv4(),
      code,
      name,
      rate,
      isActive: true
    });
  }

  createUnitOfMeasure(code: string, name: string): UnitOfMeasure {
    return new UnitOfMeasure({
      id: uuidv4(),
      code,
      name,
      isActive: true
    });
  }

  createNumberSeries(code: string, prefix: string, padding: number): NumberSeries {
    return new NumberSeries({
      id: uuidv4(),
      code,
      prefix,
      currentValue: 0,
      padding
    });
  }

  createCostCenter(code: string, name: string, departmentId?: string): CostCenter {
    return new CostCenter({
      id: uuidv4(),
      code,
      name,
      departmentId,
      isActive: true
    });
  }

  createProfitCenter(code: string, name: string): ProfitCenter {
    return new ProfitCenter({
      id: uuidv4(),
      code,
      name,
      isActive: true
    });
  }

  createFiscalCalendar(id: string, year: number, startDate: Date, endDate: Date, periods: import('./FiscalCalendar').FiscalPeriod[]): FiscalCalendar {
    return new FiscalCalendar({
      id,
      year,
      startDate,
      endDate,
      periods
    });
  }
}
