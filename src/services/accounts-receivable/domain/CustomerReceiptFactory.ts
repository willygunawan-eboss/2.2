import { CustomerReceipt, ReceiptStatus } from './CustomerReceipt';
import { v4 as uuidv4 } from 'uuid';

export class CustomerReceiptFactory {
  createReceipt(
    customerId: string,
    invoiceId: string,
    amount: number,
    receiptDate: Date,
    currencyId: string,
    referenceNumber: string
  ): CustomerReceipt {
    return new CustomerReceipt({
      id: uuidv4(),
      customerId,
      invoiceId,
      amount,
      receiptDate,
      currencyId,
      referenceNumber,
      status: ReceiptStatus.DRAFT
    });
  }
}
