import { IPostingRepository } from '../domain/IPostingRepository';

export class PostingQueryService {
  constructor(private repository: IPostingRepository) {}

  public async getLedgerPostingsByAccount(accountId: string): Promise<Record<string, unknown>[]> {
    const postings = await this.repository.getPostingsByAccountId(accountId);
    return postings.map(p => ({
      id: p.id,
      ledgerId: p.ledgerId,
      accountId: p.accountId,
      journalEntryId: p.journalEntryId,
      journalLineId: p.journalLineId,
      entryType: p.entryType,
      amount: p.amount,
      currencyId: p.currencyId,
      postingDate: p.postingDate,
      fiscalPeriodId: p.fiscalPeriodId
    }));
  }

  public async getTrialBalance(ledgerId: string): Promise<Record<string, unknown>> {
    return {
      status: 'OK',
      ledgerId
    };
  }
}
