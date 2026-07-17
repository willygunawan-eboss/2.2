import { MasterDataDomainError } from './errors/MasterDataDomainError';

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

  public reopenPeriod(periodNumber: number): void {
    const period = this.props.periods.find(p => p.periodNumber === periodNumber);
    if (!period) throw new MasterDataDomainError(`Period ${periodNumber} not found`);
    period.isClosed = false;
  }

  public closePeriod(periodNumber: number): void {
    const period = this.props.periods.find(p => p.periodNumber === periodNumber);
    if (!period) throw new MasterDataDomainError(`Period ${periodNumber} not found`);
    period.isClosed = true;
  }
}
