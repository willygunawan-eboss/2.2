import { IAccountingRepository } from '../domain/IAccountingRepository';
import { JournalEntry } from '../domain/JournalEntry';

export class AccountingQueryService {
  constructor(private repository: IAccountingRepository) {}

  public async getEntry(id: string): Promise<Record<string, unknown> | null> {
    const entry = await this.repository.getEntryById(id);
    if (!entry) return null;
    return this.mapEntryToDTO(entry);
  }

  private mapEntryToDTO(entry: JournalEntry): Record<string, unknown> {
    return {
      id: entry.id,
      journalId: entry.journalId,
      entryDate: entry.entryDate,
      sourceDocumentId: entry.sourceDocumentId,
      description: entry.description,
      status: entry.status,
      lines: entry.lines.map(line => ({
        id: line.id,
        accountId: line.accountId,
        accountType: line.accountType,
        entryType: line.entryType,
        amount: line.amount,
        currencyId: line.currencyId,
        costCenterId: line.costCenterId,
        profitCenterId: line.profitCenterId,
        description: line.description
      }))
    };
  }
}
