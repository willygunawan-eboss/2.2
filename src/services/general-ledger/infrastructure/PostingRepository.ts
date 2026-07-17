import { IPostingRepository } from '../domain/IPostingRepository';
import { LedgerPosting } from '../domain/LedgerPosting';
import { PostingBatch } from '../domain/PostingBatch';
import { Ledger } from '../domain/Ledger';
import { LedgerAccount } from '../domain/LedgerAccount';

export class PostingRepository implements IPostingRepository {
  private batches: Map<string, PostingBatch> = new Map();
  private postings: LedgerPosting[] = [];
  private ledgers: Map<string, Ledger> = new Map();
  private accounts: Map<string, LedgerAccount> = new Map();

  async saveBatch(batch: PostingBatch): Promise<void> {
    this.batches.set(batch.id, batch);
  }

  async getBatchByJournalEntryId(journalEntryId: string): Promise<PostingBatch | null> {
    for (const batch of Array.from(this.batches.values())) {
      if (batch.journalEntryId === journalEntryId) return batch;
    }
    return null;
  }

  async savePosting(posting: LedgerPosting): Promise<void> {
    this.postings.push(posting);
  }

  async getPostingsByAccountId(accountId: string): Promise<LedgerPosting[]> {
    return this.postings.filter(p => p.accountId === accountId);
  }

  async getLedger(id: string): Promise<Ledger | null> {
    return this.ledgers.get(id) || null;
  }

  async getAccount(id: string): Promise<LedgerAccount | null> {
    return this.accounts.get(id) || null;
  }

  async hasJournalBeenPosted(journalEntryId: string): Promise<boolean> {
    for (const batch of Array.from(this.batches.values())) {
      if (batch.journalEntryId === journalEntryId && batch.status === 'POSTED') {
        return true;
      }
    }
    return false;
  }
}
