import { JournalEntry } from '../../accounting/domain/JournalEntry';
import { FiscalPeriod } from '../../master-data/domain/FiscalCalendar';
import { PostingDomainError } from './PostingDomainError';

export class ClosingPolicy {
  static canClosePeriod(period: FiscalPeriod, unpostedEntries: JournalEntry[]): void {
    if (period.isClosed) {
      throw new PostingDomainError(`Period ${period.periodNumber} is already closed`);
    }
    if (unpostedEntries.length > 0) {
      throw new PostingDomainError(`Cannot close period ${period.periodNumber}. There are ${unpostedEntries.length} unposted journal entries.`);
    }
  }

  static canReopenPeriod(period: FiscalPeriod): void {
    if (!period.isClosed) {
      throw new PostingDomainError(`Period ${period.periodNumber} is already open`);
    }
  }
}
