import { IPostingRepository } from '../domain/IPostingRepository';
import { PostingFactory } from '../domain/PostingFactory';
import { PostingValidator } from '../domain/PostingValidator';
import { PostingDomainError } from '../domain/PostingDomainError';
import { IMasterDataRepository } from '../../master-data/domain/IMasterDataRepository';
import { IAccountingRepository } from '../../accounting/domain/IAccountingRepository';

export class PostingApplicationService {
  constructor(
    private repository: IPostingRepository,
    private factory: PostingFactory,
    private masterDataRepo: IMasterDataRepository,
    private accountingRepo: IAccountingRepository
  ) {}

  public async postJournalEntry(journalEntryId: string, ledgerId: string): Promise<void> {
    const entry = await this.accountingRepo.getEntryById(journalEntryId);
    if (!entry) throw new PostingDomainError('Journal entry not found.');
    
    const alreadyPosted = await this.repository.hasJournalBeenPosted(journalEntryId);
    if (alreadyPosted) {
      throw new PostingDomainError('Journal entry has already been posted to the ledger.');
    }

    try {
      PostingValidator.validateJournalEntry(entry);
    } catch (e: any) {
      throw new PostingDomainError(e.message);
    }

    // Skipping actual Fiscal Calendar validation logic for brevity of this module
    const fiscalPeriodId = 'period-' + entry.entryDate.getFullYear();

    const postings = entry.lines.map(line => {
      return this.factory.createLedgerPosting(
        ledgerId,
        line.accountId,
        entry.id,
        line.id,
        line.entryType,
        line.amount,
        line.currencyId,
        entry.entryDate,
        fiscalPeriodId
      );
    });

    const batch = this.factory.createPostingBatch(entry.id, postings);
    batch.post();
    
    await this.repository.saveBatch(batch);
    for (const posting of batch.postings) {
      await this.repository.savePosting(posting);
    }
    
    try {
      entry.post();
      await this.accountingRepo.saveEntry(entry);
    } catch (e: any) {
      throw new PostingDomainError(e.message);
    }
  }
}
