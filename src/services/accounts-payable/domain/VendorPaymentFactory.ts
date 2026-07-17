import { VendorPayment, PaymentStatus } from './VendorPayment';
import { v4 as uuidv4 } from 'uuid';

export class VendorPaymentFactory {
  createPayment(
    vendorId: string,
    invoiceId: string,
    amount: number,
    paymentDate: Date,
    currencyId: string,
    referenceNumber: string,
    cashAccountId: string
  ): VendorPayment {
    return new VendorPayment({
      id: uuidv4(),
      vendorId,
      invoiceId,
      amount,
      paymentDate,
      currencyId,
      referenceNumber,
      status: PaymentStatus.DRAFT,
      cashAccountId
    });
  }
}
