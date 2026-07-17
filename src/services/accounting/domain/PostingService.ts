import { JournalEntry } from './JournalEntry';
import { IAccountingRepository } from './IAccountingRepository';
import { AccountingDomainError } from './AccountingDomainError';

export class PostingService {
  constructor(private repository: IAccountingRepository) {}

  public async postEntry(entry: JournalEntry): Promise<void> {
    if (!entry.validateBalance()) {
      throw new AccountingDomainError("Cannot post unbalanced entry.");
    }
    
    entry.post();
    
    // In future sprints, this would interact with Ledger
    // For now, we just save the posted state of the entry
    await this.repository.saveEntry(entry);
  }
}
