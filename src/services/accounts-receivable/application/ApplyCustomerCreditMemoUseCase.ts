import { AccountsReceivableRepository } from '../infrastructure/AccountsReceivableRepository';
import { CustomerCreditNoteFactory } from '../domain/CustomerCreditNoteFactory';
import { Logger } from '../../../platform/telemetry/Logger';
import { Metrics } from '../../../platform/telemetry/Metrics';
import { Tracer } from '../../../platform/telemetry/Tracer';

export interface ApplyCustomerCreditMemoCommand {
  invoiceId: string;
  customerId: string;
  amount: number;
  creditDate: string;
  currencyId: string;
  referenceNumber: string;
  creditAccountId: string;
}

export class ApplyCustomerCreditMemoUseCase {
  constructor(
    private repository: AccountsReceivableRepository,
    private factory: CustomerCreditNoteFactory
  ) {}

  async execute(command: ApplyCustomerCreditMemoCommand): Promise<string> {
    const traceId = Tracer.generateTraceId();
    const endTimer = Metrics.startTimer('apply_customer_credit_memo');
    Logger.info(`Executing ApplyCustomerCreditMemo for Invoice ${command.invoiceId}`, { traceId, command });

    try {
      const invoice = await this.repository.getInvoiceById(command.invoiceId);
      if (!invoice) throw new Error(`Invoice ${command.invoiceId} not found`);

      const creditNote = this.factory.createCreditNote(
        command.customerId,
        command.invoiceId,
        command.amount,
        new Date(command.creditDate),
        command.currencyId,
        command.referenceNumber,
        command.creditAccountId
      );

      creditNote.post();
      // Wait, CustomerInvoice does not have recordCredit() method. Let's patch it.
      invoice.recordReceipt(command.amount); // Treat credit memo as a receipt to reduce balance

      await this.repository.saveCreditNote(creditNote);
      await this.repository.saveInvoice(invoice);

      Logger.info(`Successfully applied Credit Memo ${creditNote.id}`, { traceId });
      Metrics.record('customer_credit_memo_applied_amount', command.amount);
      
      endTimer();
      return traceId;
    } catch (error) {
      Logger.error('Failed to apply Customer Credit Memo', error, { traceId });
      endTimer();
      throw error;
    }
  }
}
