import { LedgerPosting } from './LedgerPosting';
import { PostingDomainError } from './PostingDomainError';
import { EntryType } from '../../accounting/domain/JournalLine';

export interface PostingBatchProps {
  id: string;
  journalEntryId: string;
  status: 'PENDING' | 'POSTED' | 'FAILED';
  postings: LedgerPosting[];
}

export class PostingBatch {
  constructor(private props: PostingBatchProps) {}

  get id(): string { return this.props.id; }
  get journalEntryId(): string { return this.props.journalEntryId; }
  get status(): string { return this.props.status; }
  get postings(): ReadonlyArray<LedgerPosting> { return this.props.postings; }

  public validateBalance(): boolean {
    let totalDebit = 0;
    let totalCredit = 0;
    
    for (const posting of this.props.postings) {
      if (posting.entryType === EntryType.DEBIT) {
        totalDebit += posting.amount;
      } else {
        totalCredit += posting.amount;
      }
    }
    
    return Math.abs(totalDebit - totalCredit) < 0.001;
  }

  public post(): void {
    if (this.status === 'POSTED') {
      throw new PostingDomainError('Batch is already posted.');
    }
    if (!this.validateBalance()) {
      throw new PostingDomainError('Batch is not balanced.');
    }
    this.props.status = 'POSTED';
  }
  
  public fail(): void {
    if (this.status === 'POSTED') {
      throw new PostingDomainError('Cannot fail a posted batch.');
    }
    this.props.status = 'FAILED';
  }
}
