import { CurrencyCode } from './value-objects/CurrencyCode';
import { MasterDataDomainError } from './errors/MasterDataDomainError';

export interface CurrencyProps {
  id: string;
  code: CurrencyCode;
  name: string;
  symbol: string;
  isActive: boolean;
}

export class Currency {
  constructor(private props: CurrencyProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code.value; }
  get name(): string { return this.props.name; }
  get symbol(): string { return this.props.symbol; }
  get isActive(): boolean { return this.props.isActive; }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public activate(): void {
    this.props.isActive = true;
  }
}
