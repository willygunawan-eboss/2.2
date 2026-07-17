import { IVendorCreditNoteRepository } from '../domain/IVendorCreditNoteRepository';
import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
import { VendorCreditNoteFactory } from '../domain/VendorCreditNoteFactory';
import { VendorCreditNoteError } from '../domain/VendorCreditNoteError';
import { VendorInvoiceError } from '../domain/VendorInvoiceError';

export interface RecordVendorCreditNoteDTO {
  vendorId: string;
  invoiceId: string;
  amount: number;
  creditDate: Date;
  currencyId: string;
  referenceNumber: string;
  creditAccountId: string;
}

export class VendorCreditNoteApplicationService {
  constructor(
    private creditNoteRepo: IVendorCreditNoteRepository,
    private invoiceRepo: IVendorInvoiceRepository,
    private factory: VendorCreditNoteFactory
  ) {}

  public async recordCreditNote(dto: RecordVendorCreditNoteDTO): Promise<string> {
    const invoice = await this.invoiceRepo.getById(dto.invoiceId);
    if (!invoice) throw new VendorInvoiceError("Invoice not found");
    if (invoice.vendorId !== dto.vendorId) throw new VendorCreditNoteError("Vendor mismatch");
    if (invoice.currencyId !== dto.currencyId) throw new VendorCreditNoteError("Currency mismatch");

    // Will throw if validation fails (e.g., amount > outstanding)
    try {
      invoice.recordCredit(dto.amount);
    } catch (e: any) {
      throw new VendorCreditNoteError(e.message);
    }

    const creditNote = this.factory.createCreditNote(
      dto.vendorId,
      dto.invoiceId,
      dto.amount,
      dto.creditDate,
      dto.currencyId,
      dto.referenceNumber,
      dto.creditAccountId
    );

    await this.creditNoteRepo.save(creditNote);
    await this.invoiceRepo.save(invoice);

    return creditNote.id;
  }

  public async markAsPosted(id: string): Promise<void> {
    const creditNote = await this.creditNoteRepo.getById(id);
    if (!creditNote) throw new VendorCreditNoteError("Credit Note not found");
    creditNote.post();
    await this.creditNoteRepo.save(creditNote);
  }
}
