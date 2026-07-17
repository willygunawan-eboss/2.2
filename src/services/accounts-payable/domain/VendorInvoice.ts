import { VendorInvoiceLine } from './VendorInvoiceLine';
import { VendorInvoiceError } from './VendorInvoiceError';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  VOIDED = 'VOIDED'
}

export interface VendorInvoiceProps {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currencyId: string;
  status: InvoiceStatus;
  lines: VendorInvoiceLine[];
  version?: number;
  paidAmount?: number;
  creditedAmount?: number;
}

export class VendorInvoice {
  constructor(private props: VendorInvoiceProps) {
    if (!props.lines) this.props.lines = [];
    if (props.paidAmount === undefined) this.props.paidAmount = 0;
    if (props.creditedAmount === undefined) this.props.creditedAmount = 0;
  }

  get id(): string { return this.props.id; }
  get vendorId(): string { return this.props.vendorId; }
  get invoiceNumber(): string { return this.props.invoiceNumber; }
  get invoiceDate(): Date { return this.props.invoiceDate; }
  get dueDate(): Date { return this.props.dueDate; }
  get currencyId(): string { return this.props.currencyId; }
  get status(): InvoiceStatus { return this.props.status; }
  get lines(): ReadonlyArray<VendorInvoiceLine> { return this.props.lines; }
  get paidAmount(): number { return this.props.paidAmount || 0; }
  get creditedAmount(): number { return this.props.creditedAmount || 0; }

  get version(): number { return this.props.version || 1; }
  public incrementVersion(): void { this.props.version = this.version + 1; }

  public getOutstandingBalance(): number {
    return this.getTotalAmount() - this.paidAmount - this.creditedAmount;
  }

  public recordPayment(amount: number): void {
    if (amount <= 0) throw new VendorInvoiceError("Payment amount must be greater than zero");
    if (this.status !== InvoiceStatus.POSTED && this.status !== InvoiceStatus.PARTIALLY_PAID) {
      throw new VendorInvoiceError("Payment can only be recorded for POSTED or PARTIALLY_PAID invoices");
    }
    
    const balance = this.getOutstandingBalance();
    // Use an epsilon for floating point comparison to prevent minor rounding errors
    if (amount > balance + 0.001) {
      throw new VendorInvoiceError(`Payment amount ${amount} exceeds outstanding balance ${balance}`);
    }
    
    this.props.paidAmount = this.paidAmount + amount;
    
    if (Math.abs(this.getOutstandingBalance()) < 0.001) {
      this.props.status = InvoiceStatus.PAID;
    } else {
      this.props.status = InvoiceStatus.PARTIALLY_PAID;
    }
  }

  public recordCredit(amount: number): void {
    if (amount <= 0) throw new VendorInvoiceError("Credit amount must be greater than zero");
    if (this.status !== InvoiceStatus.POSTED && this.status !== InvoiceStatus.PARTIALLY_PAID) {
      throw new VendorInvoiceError("Credit can only be recorded for POSTED or PARTIALLY_PAID invoices");
    }
    
    const balance = this.getOutstandingBalance();
    if (amount > balance + 0.001) {
      throw new VendorInvoiceError(`Credit amount ${amount} exceeds outstanding balance ${balance}`);
    }
    
    this.props.creditedAmount = this.creditedAmount + amount;
    
    if (Math.abs(this.getOutstandingBalance()) < 0.001) {
      this.props.status = InvoiceStatus.PAID;
    } else {
      this.props.status = InvoiceStatus.PARTIALLY_PAID;
    }
  }

  public addLine(line: VendorInvoiceLine): void {
    if (this.status !== InvoiceStatus.DRAFT) {
      throw new VendorInvoiceError("Cannot add lines to a non-draft invoice");
    }
    this.props.lines.push(line);
  }

  public getTotalAmount(): number {
    return this.props.lines.reduce((sum, line) => sum + line.totalAmount, 0);
  }

  public approve(): void {
    if (this.status !== InvoiceStatus.DRAFT && this.status !== InvoiceStatus.PENDING_APPROVAL) {
      throw new VendorInvoiceError("Invoice cannot be approved from current state");
    }
    this.props.status = InvoiceStatus.APPROVED;
  }

  public post(): void {
    if (this.status !== InvoiceStatus.APPROVED) {
      throw new VendorInvoiceError("Only approved invoices can be posted");
    }
    this.props.status = InvoiceStatus.POSTED;
  }
}
