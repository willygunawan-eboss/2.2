import { IVendorCreditNoteRepository } from '../domain/IVendorCreditNoteRepository';
import { VendorCreditNote } from '../domain/VendorCreditNote';

export class VendorCreditNoteQueryService {
  constructor(private repository: IVendorCreditNoteRepository) {}

  public async getCreditNote(id: string): Promise<Record<string, unknown> | null> {
    const creditNote = await this.repository.getById(id);
    if (!creditNote) return null;
    return this.mapToDTO(creditNote);
  }
  
  public async getCreditNotesByInvoiceId(invoiceId: string): Promise<Record<string, unknown>[]> {
    const creditNotes = await this.repository.getByInvoiceId(invoiceId);
    return creditNotes.map(cn => this.mapToDTO(cn));
  }

  private mapToDTO(creditNote: VendorCreditNote): Record<string, unknown> {
    return {
      id: creditNote.id,
      vendorId: creditNote.vendorId,
      invoiceId: creditNote.invoiceId,
      amount: creditNote.amount,
      creditDate: creditNote.creditDate,
      currencyId: creditNote.currencyId,
      referenceNumber: creditNote.referenceNumber,
      status: creditNote.status,
      creditAccountId: creditNote.creditAccountId
    };
  }
}
