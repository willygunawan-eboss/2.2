import { AccountingDomainError } from './AccountingDomainError';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export interface JournalLineProps {
  id: string;
  accountId: string;
  accountType: AccountType;
  entryType: EntryType;
  amount: number;
  currencyId: string;
  costCenterId?: string;
  profitCenterId?: string;
  description?: string;
}

export class JournalLine {
  constructor(private props: JournalLineProps) {
    if (props.amount <= 0) {
      throw new AccountingDomainError("Journal line amount must be greater than zero.");
    }
  }

  get id(): string { return this.props.id; }
  get accountId(): string { return this.props.accountId; }
  get accountType(): AccountType { return this.props.accountType; }
  get entryType(): EntryType { return this.props.entryType; }
  get amount(): number { return this.props.amount; }
  get currencyId(): string { return this.props.currencyId; }
  get costCenterId(): string | undefined { return this.props.costCenterId; }
  get profitCenterId(): string | undefined { return this.props.profitCenterId; }
  get description(): string | undefined { return this.props.description; }
}
