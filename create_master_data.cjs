const fs = require('fs');
const path = require('path');

const files = {
  'src/services/master-data/domain/errors/MasterDataDomainError.ts': `export class MasterDataDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MasterDataDomainError';
  }
}
`,
  'src/services/master-data/domain/value-objects/CurrencyCode.ts': `import { MasterDataDomainError } from '../errors/MasterDataDomainError';

export class CurrencyCode {
  constructor(public readonly value: string) {
    if (!value || value.length !== 3) {
      throw new MasterDataDomainError("Currency code must be exactly 3 characters.");
    }
    this.value = value.toUpperCase();
  }
}
`,
  'src/services/master-data/domain/Currency.ts': `import { CurrencyCode } from './value-objects/CurrencyCode';
import { MasterDataDomainError } from './errors/MasterDataDomainError';

export interface CurrencyProps {
  id: string;
  code: CurrencyCode;
  name: string;
  symbol: string;
  isActive: boolean;
}

export class Currency {
  constructor(private props: CurrencyProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code.value; }
  get name(): string { return this.props.name; }
  get symbol(): string { return this.props.symbol; }
  get isActive(): boolean { return this.props.isActive; }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public activate(): void {
    this.props.isActive = true;
  }
}
`,
  'src/services/master-data/domain/ExchangeRate.ts': `export interface ExchangeRateProps {
  id: string;
  baseCurrencyId: string;
  targetCurrencyId: string;
  rate: number;
  effectiveDate: Date;
}

export class ExchangeRate {
  constructor(private props: ExchangeRateProps) {}

  get id(): string { return this.props.id; }
  get baseCurrencyId(): string { return this.props.baseCurrencyId; }
  get targetCurrencyId(): string { return this.props.targetCurrencyId; }
  get rate(): number { return this.props.rate; }
  get effectiveDate(): Date { return this.props.effectiveDate; }
}
`,
  'src/services/master-data/domain/FiscalCalendar.ts': `import { MasterDataDomainError } from './errors/MasterDataDomainError';

export interface FiscalPeriod {
  periodNumber: number;
  startDate: Date;
  endDate: Date;
  isClosed: boolean;
}

export interface FiscalCalendarProps {
  id: string;
  year: number;
  startDate: Date;
  endDate: Date;
  periods: FiscalPeriod[];
}

export class FiscalCalendar {
  constructor(private props: FiscalCalendarProps) {}

  get id(): string { return this.props.id; }
  get year(): number { return this.props.year; }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date { return this.props.endDate; }
  get periods(): ReadonlyArray<FiscalPeriod> { return this.props.periods; }

  public closePeriod(periodNumber: number): void {
    const period = this.props.periods.find(p => p.periodNumber === periodNumber);
    if (!period) throw new MasterDataDomainError(\`Period \${periodNumber} not found\`);
    period.isClosed = true;
  }
}
`,
  'src/services/master-data/domain/Tax.ts': `export interface TaxProps {
  id: string;
  code: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export class Tax {
  constructor(private props: TaxProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get rate(): number { return this.props.rate; }
  get isActive(): boolean { return this.props.isActive; }
}
`,
  'src/services/master-data/domain/UnitOfMeasure.ts': `export interface UnitOfMeasureProps {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export class UnitOfMeasure {
  constructor(private props: UnitOfMeasureProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get isActive(): boolean { return this.props.isActive; }
}
`,
  'src/services/master-data/domain/NumberSeries.ts': `import { MasterDataDomainError } from './errors/MasterDataDomainError';

export interface NumberSeriesProps {
  id: string;
  code: string;
  prefix: string;
  currentValue: number;
  padding: number;
}

export class NumberSeries {
  constructor(private props: NumberSeriesProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get prefix(): string { return this.props.prefix; }
  get currentValue(): number { return this.props.currentValue; }
  get padding(): number { return this.props.padding; }

  public nextNumber(): string {
    this.props.currentValue += 1;
    const numberStr = this.props.currentValue.toString().padStart(this.props.padding, '0');
    return \`\${this.props.prefix}\${numberStr}\`;
  }
}
`,
  'src/services/master-data/domain/CostCenter.ts': `export interface CostCenterProps {
  id: string;
  code: string;
  name: string;
  departmentId?: string;
  isActive: boolean;
}

export class CostCenter {
  constructor(private props: CostCenterProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get departmentId(): string | undefined { return this.props.departmentId; }
  get isActive(): boolean { return this.props.isActive; }
}
`,
  'src/services/master-data/domain/ProfitCenter.ts': `export interface ProfitCenterProps {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export class ProfitCenter {
  constructor(private props: ProfitCenterProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get isActive(): boolean { return this.props.isActive; }
}
`,
  'src/services/master-data/domain/IMasterDataRepository.ts': `import { Currency } from './Currency';
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
  saveTax(tax: Tax): Promise<void>;
  saveUnitOfMeasure(uom: UnitOfMeasure): Promise<void>;
  
  saveNumberSeries(series: NumberSeries): Promise<void>;
  getNumberSeriesByCode(code: string): Promise<NumberSeries | null>;
  
  saveCostCenter(costCenter: CostCenter): Promise<void>;
  saveProfitCenter(profitCenter: ProfitCenter): Promise<void>;
}
`,
  'src/services/master-data/domain/MasterDataFactory.ts': `import { Currency, CurrencyProps } from './Currency';
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
}
`,
  'src/services/master-data/application/DTOs.ts': `export interface CreateCurrencyDTO {
  code: string;
  name: string;
  symbol: string;
}

export interface CreateTaxDTO {
  code: string;
  name: string;
  rate: number;
}
`,
  'src/services/master-data/application/validation/MasterDataValidator.ts': `import { CreateCurrencyDTO, CreateTaxDTO } from '../DTOs';
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
`,
  'src/services/master-data/application/MasterDataApplicationService.ts': `import { IMasterDataRepository } from '../domain/IMasterDataRepository';
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
      throw new MasterDataDomainError(\`Number series \${seriesCode} not found\`);
    }
    const nextNumber = series.nextNumber();
    await this.repository.saveNumberSeries(series);
    return nextNumber;
  }
}
`,
  'src/services/master-data/application/MasterDataQueryService.ts': `import { IMasterDataRepository } from '../domain/IMasterDataRepository';

export class MasterDataQueryService {
  constructor(private repository: IMasterDataRepository) {}

  public async getCurrency(id: string): Promise<any> {
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
`,
  'src/services/master-data/infrastructure/MasterDataMapper.ts': `import { Currency } from '../domain/Currency';
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
`,
  'src/services/master-data/infrastructure/MasterDataRepository.ts': `import { IMasterDataRepository } from '../domain/IMasterDataRepository';
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
  private numberSeries: Map<string, NumberSeries> = new Map();

  async saveCurrency(currency: Currency): Promise<void> {
    this.currencies.set(currency.id, currency);
  }

  async getCurrency(id: string): Promise<Currency | null> {
    return this.currencies.get(id) || null;
  }

  async saveExchangeRate(rate: ExchangeRate): Promise<void> {}
  async saveFiscalCalendar(calendar: FiscalCalendar): Promise<void> {}
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
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
}
console.log('Master Data files created successfully');
