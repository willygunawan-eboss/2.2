import { JournalEntry, JournalEntryStatus } from '../../accounting/domain/JournalEntry';
import { FiscalCalendar } from '../../master-data/domain/FiscalCalendar';
import { PostingDomainError } from './PostingDomainError';

export class PostingValidator {
  static validateJournalEntry(entry: JournalEntry): void {
    if (entry.status === JournalEntryStatus.POSTED) {
      throw new PostingDomainError('Journal is already posted.');
    }
    if (entry.status === JournalEntryStatus.VOIDED) {
      throw new PostingDomainError('Cannot post a voided journal.');
    }
    if (!entry.validateBalance()) {
      throw new PostingDomainError('Debit must be equal to Credit.');
    }
  }

  static validateFiscalPeriod(calendar: FiscalCalendar, postingDate: Date): string {
    const period = calendar.periods.find(p => 
      postingDate >= p.startDate && postingDate <= p.endDate
    );
    
    if (!period) {
      throw new PostingDomainError('No fiscal period found for posting date.');
    }
    if (period.isClosed) {
      throw new PostingDomainError('Fiscal period is closed.');
    }
    
    return period.periodNumber.toString();
  }
}
