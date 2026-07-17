import { AccountsPayableRepository } from '../infrastructure/AccountsPayableRepository';
import { VendorCreditNoteFactory } from '../domain/VendorCreditNoteFactory';
import { Logger } from '../../../platform/telemetry/Logger';
import { Metrics } from '../../../platform/telemetry/Metrics';
import { Tracer } from '../../../platform/telemetry/Tracer';
import { VendorCreditNoteError } from '../domain/VendorCreditNoteError';

export interface ApplyVendorCreditMemoCommand {
  invoiceId: string;
  vendorId: string;
  amount: number;
  creditDate: string;
  currencyId: string;
  referenceNumber: string;
  creditAccountId: string;
}

export class ApplyVendorCreditMemoUseCase {
  constructor(
    private repository: AccountsPayableRepository,
    private factory: VendorCreditNoteFactory
  ) {}

  async execute(command: ApplyVendorCreditMemoCommand): Promise<string> {
    const traceId = Tracer.generateTraceId();
    const endTimer = Metrics.startTimer('apply_vendor_credit_memo');
    Logger.info(`Executing ApplyVendorCreditMemo for Invoice ${command.invoiceId}`, { traceId, command });

    try {
      const invoice = await this.repository.getInvoiceById(command.invoiceId);
      if (!invoice) {
        throw new VendorCreditNoteError(`Invoice ${command.invoiceId} not found`);
      }

      const creditNote = this.factory.createCreditNote(
        command.vendorId,
        command.invoiceId,
        command.amount,
        new Date(command.creditDate),
        command.currencyId,
        command.referenceNumber,
        command.creditAccountId
      );

      creditNote.post();
      invoice.recordCredit(command.amount);

      // Save using simple Unit of Work / Transaction (Mocking transaction for now by executing sequentially)
      await this.repository.saveCreditNote(creditNote);
      await this.repository.saveInvoice(invoice);

      Logger.info(`Successfully applied Credit Memo ${creditNote.id}`, { traceId });
      Metrics.record('vendor_credit_memo_applied_amount', command.amount);
      
      endTimer();
      return traceId;
    } catch (error) {
      Logger.error('Failed to apply Vendor Credit Memo', error, { traceId });
      endTimer();
      throw error;
    }
  }
}
