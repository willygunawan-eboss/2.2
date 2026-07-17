export interface ExchangeRateProps {
  id: string;
  baseCurrencyId: string;
  targetCurrencyId: string;
  rate: number;
  effectiveDate: Date;
}

export class ExchangeRate {
  constructor(private props: ExchangeRateProps) {}

  get id(): string { return this.props.id; }
  get baseCurrencyId(): string { return this.props.baseCurrencyId; }
  get targetCurrencyId(): string { return this.props.targetCurrencyId; }
  get rate(): number { return this.props.rate; }
  get effectiveDate(): Date { return this.props.effectiveDate; }
}
