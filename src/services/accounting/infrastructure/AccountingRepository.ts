import { IAccountingRepository } from '../domain/IAccountingRepository';
import { JournalEntry } from '../domain/JournalEntry';
import { Journal } from '../domain/Journal';

// Mock repository for Architecture setup
export class AccountingRepository implements IAccountingRepository {
  private entries: Map<string, JournalEntry> = new Map();
  private journals: Map<string, Journal> = new Map();

  async saveEntry(entry: JournalEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async getUnpostedEntriesInDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    const unposted: JournalEntry[] = [];
    for (const entry of this.entries.values()) {
      if (entry.status !== 'POSTED' && entry.entryDate >= startDate && entry.entryDate <= endDate) {
        unposted.push(entry);
      }
    }
    return unposted;
  }
  async getEntryById(id: string): Promise<JournalEntry | null> {
    return this.entries.get(id) || null;
  }

  async saveJournal(journal: Journal): Promise<void> {
    this.journals.set(journal.id, journal);
  }

  async getJournalById(id: string): Promise<Journal | null> {
    return this.journals.get(id) || null;
  }

  async getJournalByCode(code: string): Promise<Journal | null> {
    for (const journal of Array.from(this.journals.values())) {
      if (journal.code === code) return journal;
    }
    return null;
  }
}
