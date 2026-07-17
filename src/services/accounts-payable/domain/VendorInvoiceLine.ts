import { VendorInvoiceError } from './VendorInvoiceError';

export interface VendorInvoiceLineProps {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  accountId: string;
  costCenterId?: string;
}

export class VendorInvoiceLine {
  constructor(private props: VendorInvoiceLineProps) {
    if (props.quantity <= 0) throw new VendorInvoiceError("Quantity must be greater than zero");
    if (props.unitPrice < 0) throw new VendorInvoiceError("Unit price cannot be negative");
  }

  get id(): string { return this.props.id; }
  get invoiceId(): string { return this.props.invoiceId; }
  get description(): string { return this.props.description; }
  get quantity(): number { return this.props.quantity; }
  get unitPrice(): number { return this.props.unitPrice; }
  get taxAmount(): number { return this.props.taxAmount; }
  get accountId(): string { return this.props.accountId; }
  get costCenterId(): string | undefined { return this.props.costCenterId; }
  get totalAmount(): number { return (this.props.quantity * this.props.unitPrice) + this.props.taxAmount; }
}
