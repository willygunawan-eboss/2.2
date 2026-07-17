import { JournalEntry, JournalEntryStatus } from './JournalEntry';
import { JournalLine, EntryType, AccountType } from './JournalLine';
import { v4 as uuidv4 } from 'uuid';
import { AccountingDomainError } from './AccountingDomainError';

export class JournalBuilder {
  private entry: JournalEntry;

  constructor(journalId: string, description: string, entryDate: Date = new Date(), sourceDocumentId?: string) {
    this.entry = new JournalEntry({
      id: uuidv4(),
      journalId,
      entryDate,
      sourceDocumentId,
      description,
      status: JournalEntryStatus.DRAFT,
      lines: []
    });
  }

  public addDebit(
    accountId: string, 
    accountType: AccountType, 
    amount: number, 
    currencyId: string, 
    costCenterId?: string, 
    profitCenterId?: string, 
    description?: string
  ): JournalBuilder {
    const line = new JournalLine({
      id: uuidv4(),
      accountId,
      accountType,
      entryType: EntryType.DEBIT,
      amount,
      currencyId,
      costCenterId,
      profitCenterId,
      description
    });
    this.entry.addLine(line);
    return this;
  }

  public addCredit(
    accountId: string, 
    accountType: AccountType, 
    amount: number, 
    currencyId: string, 
    costCenterId?: string, 
    profitCenterId?: string, 
    description?: string
  ): JournalBuilder {
    const line = new JournalLine({
      id: uuidv4(),
      accountId,
      accountType,
      entryType: EntryType.CREDIT,
      amount,
      currencyId,
      costCenterId,
      profitCenterId,
      description
    });
    this.entry.addLine(line);
    return this;
  }

  public build(): JournalEntry {
    if (!this.entry.validateBalance()) {
      throw new AccountingDomainError("Cannot build an unbalanced journal entry.");
    }
    return this.entry;
  }
}
