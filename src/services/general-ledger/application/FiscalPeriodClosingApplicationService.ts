import { FiscalCalendar } from '../../master-data/domain/FiscalCalendar';
import { IMasterDataRepository } from '../../master-data/domain/IMasterDataRepository';
import { ClosingPolicy } from '../domain/ClosingPolicy';
import { ClosingValidator } from '../domain/ClosingValidator';
import { IAccountingRepository } from '../../accounting/domain/IAccountingRepository';

export class FiscalPeriodClosingApplicationService {
  constructor(
    private masterDataRepo: IMasterDataRepository,
    private accountingRepo: IAccountingRepository
  ) {}

  async closePeriod(calendarId: string, periodNumber: number): Promise<void> {
    const calendar = await this.masterDataRepo.getFiscalCalendar(calendarId);
    if (!calendar) throw new Error(`Calendar ${calendarId} not found`);

    const period = ClosingValidator.validatePeriodExists(calendar, periodNumber);
    
    const unpostedEntries = await this.accountingRepo.getUnpostedEntriesInDateRange(period.startDate, period.endDate);
    
    ClosingPolicy.canClosePeriod(period, unpostedEntries);

    calendar.closePeriod(periodNumber);
    await this.masterDataRepo.saveFiscalCalendar(calendar);
  }

  async reopenPeriod(calendarId: string, periodNumber: number): Promise<void> {
    const calendar = await this.masterDataRepo.getFiscalCalendar(calendarId);
    if (!calendar) throw new Error(`Calendar ${calendarId} not found`);

    const period = ClosingValidator.validatePeriodExists(calendar, periodNumber);
    
    ClosingPolicy.canReopenPeriod(period);

    calendar.reopenPeriod(periodNumber);
    await this.masterDataRepo.saveFiscalCalendar(calendar);
  }
}
