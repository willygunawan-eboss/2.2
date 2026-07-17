import { EntryType } from '../../accounting/domain/JournalLine';

export interface LedgerPostingProps {
  id: string;
  ledgerId: string;
  accountId: string;
  journalEntryId: string;
  journalLineId: string;
  entryType: EntryType;
  amount: number;
  currencyId: string;
  postingDate: Date;
  fiscalPeriodId: string;
}

export class LedgerPosting {
  constructor(private props: LedgerPostingProps) {}

  get id(): string { return this.props.id; }
  get ledgerId(): string { return this.props.ledgerId; }
  get accountId(): string { return this.props.accountId; }
  get journalEntryId(): string { return this.props.journalEntryId; }
  get journalLineId(): string { return this.props.journalLineId; }
  get entryType(): EntryType { return this.props.entryType; }
  get amount(): number { return this.props.amount; }
  get currencyId(): string { return this.props.currencyId; }
  get postingDate(): Date { return this.props.postingDate; }
  get fiscalPeriodId(): string { return this.props.fiscalPeriodId; }
}
