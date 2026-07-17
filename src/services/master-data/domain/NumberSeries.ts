import { MasterDataDomainError } from './errors/MasterDataDomainError';

export interface NumberSeriesProps {
  id: string;
  code: string;
  prefix: string;
  currentValue: number;
  padding: number;
}

export class NumberSeries {
  constructor(private props: NumberSeriesProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get prefix(): string { return this.props.prefix; }
  get currentValue(): number { return this.props.currentValue; }
  get padding(): number { return this.props.padding; }

  public nextNumber(): string {
    this.props.currentValue += 1;
    const numberStr = this.props.currentValue.toString().padStart(this.props.padding, '0');
    return `${this.props.prefix}${numberStr}`;
  }
}
