import { describe, it, expect, beforeEach } from 'vitest';
import { PostingApplicationService } from './PostingApplicationService';
import { PostingRepository } from '../infrastructure/PostingRepository';
import { PostingFactory } from '../domain/PostingFactory';
import { JournalEntry, JournalEntryStatus } from '../../accounting/domain/JournalEntry';
import { JournalLine, EntryType, AccountType } from '../../accounting/domain/JournalLine';
import { MasterDataRepository } from '../../master-data/infrastructure/MasterDataRepository';
import { AccountingRepository } from '../../accounting/infrastructure/AccountingRepository';
import { PostingDomainError } from '../domain/PostingDomainError';

describe('General Ledger Posting logic', () => {
  let service: PostingApplicationService;
  let postingRepo: PostingRepository;
  let masterDataRepo: MasterDataRepository;
  let accountingRepo: AccountingRepository;

  beforeEach(() => {
    postingRepo = new PostingRepository();
    masterDataRepo = new MasterDataRepository();
    accountingRepo = new AccountingRepository();
    service = new PostingApplicationService(
      postingRepo,
      new PostingFactory(),
      masterDataRepo,
      accountingRepo
    );
  });

  it('Posting Validation Test: Should post a balanced journal entry successfully', async () => {
    const entry = new JournalEntry({
      id: 'JE-1',
      journalId: 'J-1',
      entryDate: new Date(),
      description: 'Test',
      status: JournalEntryStatus.DRAFT,
      lines: [
        new JournalLine({
          id: 'L-1', accountId: 'A-1', accountType: AccountType.ASSET,
          entryType: EntryType.DEBIT, amount: 100, currencyId: 'USD'
        }),
        new JournalLine({
          id: 'L-2', accountId: 'A-2', accountType: AccountType.REVENUE,
          entryType: EntryType.CREDIT, amount: 100, currencyId: 'USD'
        })
      ]
    });
    await accountingRepo.saveEntry(entry);

    await service.postJournalEntry('JE-1', 'LEDGER-1');
    const postedEntry = await accountingRepo.getEntryById('JE-1');
    expect(postedEntry?.status).toBe(JournalEntryStatus.POSTED);
  });

  it('Double Posting Test: Should throw error if posting again', async () => {
    const entry = new JournalEntry({
      id: 'JE-2',
      journalId: 'J-1',
      entryDate: new Date(),
      description: 'Test',
      status: JournalEntryStatus.DRAFT,
      lines: [
        new JournalLine({
          id: 'L-1', accountId: 'A-1', accountType: AccountType.ASSET,
          entryType: EntryType.DEBIT, amount: 50, currencyId: 'USD'
        }),
        new JournalLine({
          id: 'L-2', accountId: 'A-2', accountType: AccountType.REVENUE,
          entryType: EntryType.CREDIT, amount: 50, currencyId: 'USD'
        })
      ]
    });
    await accountingRepo.saveEntry(entry);

    await service.postJournalEntry('JE-2', 'LEDGER-1');
    await expect(service.postJournalEntry('JE-2', 'LEDGER-1'))
      .rejects.toThrowError(PostingDomainError);
  });

  it('Unbalanced Entry Test: Should fail to post if unbalanced', async () => {
    const entry = new JournalEntry({
      id: 'JE-3',
      journalId: 'J-1',
      entryDate: new Date(),
      description: 'Test',
      status: JournalEntryStatus.DRAFT,
      lines: [
        new JournalLine({
          id: 'L-1', accountId: 'A-1', accountType: AccountType.ASSET,
          entryType: EntryType.DEBIT, amount: 100, currencyId: 'USD'
        }),
        new JournalLine({
          id: 'L-2', accountId: 'A-2', accountType: AccountType.REVENUE,
          entryType: EntryType.CREDIT, amount: 50, currencyId: 'USD'
        })
      ]
    });
    await accountingRepo.saveEntry(entry);

    await expect(service.postJournalEntry('JE-3', 'LEDGER-1'))
      .rejects.toThrowError(PostingDomainError);
  });
});
