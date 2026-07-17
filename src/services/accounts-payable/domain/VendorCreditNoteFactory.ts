import { VendorCreditNote, CreditNoteStatus } from './VendorCreditNote';
import { v4 as uuidv4 } from 'uuid';

export class VendorCreditNoteFactory {
  createCreditNote(
    vendorId: string,
    invoiceId: string,
    amount: number,
    creditDate: Date,
    currencyId: string,
    referenceNumber: string,
    creditAccountId: string
  ): VendorCreditNote {
    return new VendorCreditNote({
      id: uuidv4(),
      vendorId,
      invoiceId,
      amount,
      creditDate,
      currencyId,
      referenceNumber,
      status: CreditNoteStatus.DRAFT,
      creditAccountId
    });
  }
}
