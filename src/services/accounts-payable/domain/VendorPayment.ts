import { VendorPaymentError } from './VendorPaymentError';

export enum PaymentStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  VOIDED = 'VOIDED'
}

export interface VendorPaymentProps {
  id: string;
  vendorId: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  currencyId: string;
  referenceNumber: string;
  status: PaymentStatus;
  cashAccountId: string;
}

export class VendorPayment {
  constructor(private props: VendorPaymentProps) {
    if (props.amount <= 0) throw new VendorPaymentError("Payment amount must be greater than zero");
  }

  get id(): string { return this.props.id; }
  get vendorId(): string { return this.props.vendorId; }
  get invoiceId(): string { return this.props.invoiceId; }
  get amount(): number { return this.props.amount; }
  get paymentDate(): Date { return this.props.paymentDate; }
  get currencyId(): string { return this.props.currencyId; }
  get referenceNumber(): string { return this.props.referenceNumber; }
  get status(): PaymentStatus { return this.props.status; }
  get cashAccountId(): string { return this.props.cashAccountId; }

  public post(): void {
    if (this.status !== PaymentStatus.DRAFT) {
      throw new VendorPaymentError("Only draft payments can be posted");
    }
    this.props.status = PaymentStatus.POSTED;
  }
  
  public void(): void {
    if (this.status === PaymentStatus.VOIDED) {
      throw new VendorPaymentError("Payment is already voided");
    }
    this.props.status = PaymentStatus.VOIDED;
  }
}
