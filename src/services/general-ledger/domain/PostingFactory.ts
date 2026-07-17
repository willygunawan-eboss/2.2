import { LedgerPosting } from './LedgerPosting';
import { PostingBatch } from './PostingBatch';
import { v4 as uuidv4 } from 'uuid';

export class PostingFactory {
  createLedgerPosting(
    ledgerId: string,
    accountId: string,
    journalEntryId: string,
    journalLineId: string,
    entryType: any,
    amount: number,
    currencyId: string,
    postingDate: Date,
    fiscalPeriodId: string
  ): LedgerPosting {
    return new LedgerPosting({
      id: uuidv4(),
      ledgerId,
      accountId,
      journalEntryId,
      journalLineId,
      entryType,
      amount,
      currencyId,
      postingDate,
      fiscalPeriodId
    });
  }

  createPostingBatch(journalEntryId: string, postings: LedgerPosting[]): PostingBatch {
    return new PostingBatch({
      id: uuidv4(),
      journalEntryId,
      status: 'PENDING',
      postings
    });
  }
}
