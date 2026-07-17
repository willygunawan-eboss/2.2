export enum CreditNoteStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  VOIDED = 'VOIDED'
}
export interface CustomerCreditNoteProps {
  id: string;
  customerId: string;
  invoiceId: string;
  amount: number;
  creditDate: Date;
  currencyId: string;
  referenceNumber: string;
  status: CreditNoteStatus;
  creditAccountId: string;
}
export class CustomerCreditNote {
  constructor(private props: CustomerCreditNoteProps) {
    if (props.amount <= 0) throw new Error("Credit note amount must be greater than zero");
  }
  get id(): string { return this.props.id; }
  get customerId(): string { return this.props.customerId; }
  get invoiceId(): string { return this.props.invoiceId; }
  get amount(): number { return this.props.amount; }
  get creditDate(): Date { return this.props.creditDate; }
  get currencyId(): string { return this.props.currencyId; }
  get referenceNumber(): string { return this.props.referenceNumber; }
  get status(): CreditNoteStatus { return this.props.status; }
  get creditAccountId(): string { return this.props.creditAccountId; }
  public post(): void {
    if (this.status !== CreditNoteStatus.DRAFT) {
      throw new Error("Only draft credit notes can be posted");
    }
    this.props.status = CreditNoteStatus.POSTED;
  }
  public void(): void {
    if (this.status === CreditNoteStatus.VOIDED) {
      throw new Error("Credit note is already voided");
    }
    this.props.status = CreditNoteStatus.VOIDED;
  }
}
