import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { VendorCreditNoteApplicationService, RecordVendorCreditNoteDTO } from '../VendorCreditNoteApplicationService';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingEvent } from '../../../accounting/domain/AccountingEvent';
import { IVendorCreditNoteRepository } from '../../domain/IVendorCreditNoteRepository';
import { VendorCreditNoteError } from '../../domain/VendorCreditNoteError';

export interface RecordCreditNoteResponse {
  creditNoteId: string;
  status: string;
}

export class RecordVendorCreditNoteCoordinator implements IProcessCoordinator<RecordVendorCreditNoteDTO, RecordCreditNoteResponse> {
  constructor(
    private creditNoteService: VendorCreditNoteApplicationService,
    private creditNoteRepo: IVendorCreditNoteRepository,
    private accountingService: AccountingApplicationService,
    private vendorPayableAccountId: string
  ) {}

  public async execute(request: RecordVendorCreditNoteDTO, context: ProcessContext): Promise<ProcessResult<RecordCreditNoteResponse>> {
    try {
      // 1. Record Credit Note (Business Document & State Update)
      const creditNoteId = await this.creditNoteService.recordCreditNote(request);
      const creditNote = await this.creditNoteRepo.getById(creditNoteId);
      if (!creditNote) throw new VendorCreditNoteError("Credit Note creation failed");

      // 2. Prepare Accounting Event
      const payload = {
        creditNoteId: creditNote.id,
        invoiceId: creditNote.invoiceId,
        vendorId: creditNote.vendorId,
        payableAccountId: this.vendorPayableAccountId,
        creditAccountId: creditNote.creditAccountId,
        currencyId: creditNote.currencyId,
        amount: creditNote.amount
      };

      const accountingEvent: AccountingEvent = {
        eventId: `EV-AP-CRED-${creditNote.id}`,
        eventType: 'VENDOR_CREDIT_NOTE_RECORDED',
        occurredOn: new Date(),
        sourceDocumentId: creditNote.id,
        sourceSystem: 'ACCOUNTS_PAYABLE',
        payload
      };

      // 3. Send to Accounting Platform
      await this.accountingService.processAccountingEvent(accountingEvent);

      // 4. Update Document Status
      await this.creditNoteService.markAsPosted(creditNote.id);

      return ProcessResult.success({
        creditNoteId,
        status: 'RECORDED_AND_POSTED'
      });
    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
