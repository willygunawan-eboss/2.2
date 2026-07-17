import { VendorCreditNote } from './VendorCreditNote';

export interface IVendorCreditNoteRepository {
  save(creditNote: VendorCreditNote): Promise<void>;
  getById(id: string): Promise<VendorCreditNote | null>;
  getByInvoiceId(invoiceId: string): Promise<VendorCreditNote[]>;
}
