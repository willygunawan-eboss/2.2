import { JournalEntry } from './JournalEntry';
import { Journal } from './Journal';

export interface IAccountingRepository {
  saveEntry(entry: JournalEntry): Promise<void>;
  getEntryById(id: string): Promise<JournalEntry | null>;
  getUnpostedEntriesInDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]>;
  
  saveJournal(journal: Journal): Promise<void>;
  getJournalById(id: string): Promise<Journal | null>;
  getJournalByCode(code: string): Promise<Journal | null>;
}
