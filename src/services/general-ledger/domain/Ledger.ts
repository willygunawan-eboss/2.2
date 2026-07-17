import { PostingDomainError } from './PostingDomainError';

export interface LedgerProps {
  id: string;
  code: string;
  name: string;
  currencyId: string;
  isActive: boolean;
}

export class Ledger {
  constructor(private props: LedgerProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get currencyId(): string { return this.props.currencyId; }
  get isActive(): boolean { return this.props.isActive; }
}
