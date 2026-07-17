export interface TaxProps {
  id: string;
  code: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export class Tax {
  constructor(private props: TaxProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get rate(): number { return this.props.rate; }
  get isActive(): boolean { return this.props.isActive; }
}
