import { CustomerReceiptError } from './CustomerReceiptError';

export enum ReceiptStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  VOIDED = 'VOIDED'
}

export interface CustomerReceiptProps {
  id: string;
  customerId: string;
  invoiceId: string;
  amount: number;
  receiptDate: Date;
  currencyId: string;
  referenceNumber: string;
  status: ReceiptStatus;
}

export class CustomerReceipt {
  constructor(private props: CustomerReceiptProps) {}

  get id(): string { return this.props.id; }
  get customerId(): string { return this.props.customerId; }
  get invoiceId(): string { return this.props.invoiceId; }
  get amount(): number { return this.props.amount; }
  get receiptDate(): Date { return this.props.receiptDate; }
  get currencyId(): string { return this.props.currencyId; }
  get referenceNumber(): string { return this.props.referenceNumber; }
  get status(): ReceiptStatus { return this.props.status; }

  public post(): void {
    if (this.status !== ReceiptStatus.DRAFT) {
      throw new CustomerReceiptError("Only draft receipts can be posted");
    }
    this.props.status = ReceiptStatus.POSTED;
  }

  public void(): void {
    if (this.status === ReceiptStatus.VOIDED) {
      throw new CustomerReceiptError("Receipt is already voided");
    }
    this.props.status = ReceiptStatus.VOIDED;
  }
}
