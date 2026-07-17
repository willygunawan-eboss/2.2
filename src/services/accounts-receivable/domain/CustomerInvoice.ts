import { CustomerInvoiceError } from './CustomerInvoiceError';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  VOIDED = 'VOIDED'
}

export interface CustomerInvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  revenueAccountId: string;
}

export interface CustomerInvoiceProps {
  id: string;
  customerId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currencyId: string;
  status: InvoiceStatus;
  lines: CustomerInvoiceLine[];
  version?: number;
  paidAmount?: number;
  creditedAmount?: number;
}

export class CustomerInvoice {
  constructor(private props: CustomerInvoiceProps) {
    if (!props.lines) this.props.lines = [];
    if (props.paidAmount === undefined) this.props.paidAmount = 0;
    if (props.creditedAmount === undefined) this.props.creditedAmount = 0;
  }

  get id(): string { return this.props.id; }
  get customerId(): string { return this.props.customerId; }
  get invoiceNumber(): string { return this.props.invoiceNumber; }
  get invoiceDate(): Date { return this.props.invoiceDate; }
  get dueDate(): Date { return this.props.dueDate; }
  get currencyId(): string { return this.props.currencyId; }
  get status(): InvoiceStatus { return this.props.status; }
  get lines(): ReadonlyArray<CustomerInvoiceLine> { return this.props.lines; }
  get paidAmount(): number { return this.props.paidAmount || 0; }
  get creditedAmount(): number { return this.props.creditedAmount || 0; }

  get version(): number { return this.props.version || 1; }
  public incrementVersion(): void { this.props.version = this.version + 1; }

  public getTotalAmount(): number {
    return this.props.lines.reduce((total, line) => total + (line.quantity * line.unitPrice) + line.taxAmount, 0);
  }

  public getOutstandingBalance(): number {
    return this.getTotalAmount() - this.paidAmount - this.creditedAmount;
  }

  public addLine(line: CustomerInvoiceLine): void {
    if (this.status !== InvoiceStatus.DRAFT) {
      throw new CustomerInvoiceError("Cannot add lines to a non-draft invoice");
    }
    this.props.lines.push(line);
  }

  public approve(): void {
    if (this.status !== InvoiceStatus.DRAFT && this.status !== InvoiceStatus.PENDING_APPROVAL) {
      throw new CustomerInvoiceError("Only draft or pending invoices can be approved");
    }
    this.props.status = InvoiceStatus.APPROVED;
  }

  public post(): void {
    if (this.status !== InvoiceStatus.APPROVED) {
      throw new CustomerInvoiceError("Only approved invoices can be posted");
    }
    if (this.lines.length === 0) {
      throw new CustomerInvoiceError("Cannot post an invoice without lines");
    }
    this.props.status = InvoiceStatus.POSTED;
  }

  public void(): void {
    if (this.status === InvoiceStatus.VOIDED) {
      throw new CustomerInvoiceError("Invoice is already voided");
    }
    this.props.status = InvoiceStatus.VOIDED;
  }

  public recordReceipt(amount: number): void {
    if (this.status !== InvoiceStatus.POSTED && this.status !== InvoiceStatus.PARTIALLY_PAID) {
      throw new CustomerInvoiceError("Receipt can only be recorded for POSTED or PARTIALLY_PAID invoices");
    }
    
    const outstanding = this.getOutstandingBalance();
    if (amount > outstanding) {
      throw new CustomerInvoiceError(`Receipt amount ${amount} exceeds outstanding balance ${outstanding}`);
    }

    this.props.paidAmount = (this.props.paidAmount || 0) + amount;

    if (this.getOutstandingBalance() === 0) {
      this.props.status = InvoiceStatus.PAID;
    } else {
      this.props.status = InvoiceStatus.PARTIALLY_PAID;
    }
  }
}
