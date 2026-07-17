import { AccountType } from '../../accounting/domain/JournalLine';

export interface LedgerAccountProps {
  id: string;
  ledgerId: string;
  code: string;
  name: string;
  accountType: AccountType;
  isActive: boolean;
}

export class LedgerAccount {
  constructor(private props: LedgerAccountProps) {}

  get id(): string { return this.props.id; }
  get ledgerId(): string { return this.props.ledgerId; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get accountType(): AccountType { return this.props.accountType; }
  get isActive(): boolean { return this.props.isActive; }
}
