import { CustomerCreditNote, CreditNoteStatus } from './CustomerCreditNote';
import { v4 as uuidv4 } from 'uuid';

export class CustomerCreditNoteFactory {
  createCreditNote(customerId: string, invoiceId: string, amount: number, creditDate: Date, currencyId: string, referenceNumber: string, creditAccountId: string): CustomerCreditNote {
    return new CustomerCreditNote({
      id: uuidv4(),
      customerId,
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
