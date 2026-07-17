import { LedgerPosting } from './LedgerPosting';
import { PostingBatch } from './PostingBatch';
import { Ledger } from './Ledger';
import { LedgerAccount } from './LedgerAccount';

export interface IPostingRepository {
  saveBatch(batch: PostingBatch): Promise<void>;
  getBatchByJournalEntryId(journalEntryId: string): Promise<PostingBatch | null>;
  
  savePosting(posting: LedgerPosting): Promise<void>;
  getPostingsByAccountId(accountId: string): Promise<LedgerPosting[]>;
  
  getLedger(id: string): Promise<Ledger | null>;
  getAccount(id: string): Promise<LedgerAccount | null>;
  
  hasJournalBeenPosted(journalEntryId: string): Promise<boolean>;
}
