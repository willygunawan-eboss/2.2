import { IVendorCreditNoteRepository } from '../domain/IVendorCreditNoteRepository';
import { VendorCreditNote } from '../domain/VendorCreditNote';

export class VendorCreditNoteRepository implements IVendorCreditNoteRepository {
  private creditNotes: Map<string, VendorCreditNote> = new Map();

  async save(creditNote: VendorCreditNote): Promise<void> {
    this.creditNotes.set(creditNote.id, creditNote);
  }

  async getById(id: string): Promise<VendorCreditNote | null> {
    return this.creditNotes.get(id) || null;
  }

  async getByInvoiceId(invoiceId: string): Promise<VendorCreditNote[]> {
    return Array.from(this.creditNotes.values()).filter(cn => cn.invoiceId === invoiceId);
  }
}
