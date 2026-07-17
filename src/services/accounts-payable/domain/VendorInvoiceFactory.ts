import { VendorInvoice, InvoiceStatus } from './VendorInvoice';
import { VendorInvoiceLine } from './VendorInvoiceLine';
import { v4 as uuidv4 } from 'uuid';

export class VendorInvoiceFactory {
  createInvoice(vendorId: string, invoiceNumber: string, invoiceDate: Date, dueDate: Date, currencyId: string): VendorInvoice {
    return new VendorInvoice({
      id: uuidv4(),
      vendorId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      currencyId,
      status: InvoiceStatus.DRAFT,
      lines: []
    });
  }

  createLine(invoiceId: string, description: string, quantity: number, unitPrice: number, taxAmount: number, accountId: string, costCenterId?: string): VendorInvoiceLine {
    return new VendorInvoiceLine({
      id: uuidv4(),
      invoiceId,
      description,
      quantity,
      unitPrice,
      taxAmount,
      accountId,
      costCenterId
    });
  }
}
