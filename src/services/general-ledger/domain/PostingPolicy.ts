import { JournalEntry } from '../../accounting/domain/JournalEntry';
import { FiscalCalendar } from '../../master-data/domain/FiscalCalendar';
import { PostingValidator } from './PostingValidator';

export class PostingPolicy {
  public static canPost(entry: JournalEntry, calendar: FiscalCalendar): boolean {
    try {
      PostingValidator.validateJournalEntry(entry);
      PostingValidator.validateFiscalPeriod(calendar, entry.entryDate);
      return true;
    } catch (e) {
      return false;
    }
  }
}
