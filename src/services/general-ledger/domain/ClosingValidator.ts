import { FiscalCalendar } from '../../master-data/domain/FiscalCalendar';
import { PostingDomainError } from './PostingDomainError';

export class ClosingValidator {
  static validatePeriodExists(calendar: FiscalCalendar, periodNumber: number) {
    const period = calendar.periods.find(p => p.periodNumber === periodNumber);
    if (!period) {
      throw new PostingDomainError(`Period ${periodNumber} does not exist in calendar ${calendar.id}`);
    }
    return period;
  }
}
