import { CustomerInvoice, InvoiceStatus, CustomerInvoiceLine } from './CustomerInvoice';
import { v4 as uuidv4 } from 'uuid';

export class CustomerInvoiceFactory {
  createInvoice(
    customerId: string,
    invoiceNumber: string,
    invoiceDate: Date,
    dueDate: Date,
    currencyId: string
  ): CustomerInvoice {
    return new CustomerInvoice({
      id: uuidv4(),
      customerId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      currencyId,
      status: InvoiceStatus.DRAFT,
      lines: [],
      paidAmount: 0,
      creditedAmount: 0
    });
  }

  createLine(
    description: string,
    quantity: number,
    unitPrice: number,
    taxAmount: number,
    revenueAccountId: string
  ): CustomerInvoiceLine {
    return {
      id: uuidv4(),
      description,
      quantity,
      unitPrice,
      taxAmount,
      revenueAccountId
    };
  }
}
