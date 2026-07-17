import { AccountsReceivableRepository } from '../infrastructure/AccountsReceivableRepository';
import { CustomerReceiptFactory } from '../domain/CustomerReceiptFactory';
import { Logger } from '../../../platform/telemetry/Logger';
import { Metrics } from '../../../platform/telemetry/Metrics';
import { Tracer } from '../../../platform/telemetry/Tracer';

export class ReconcileARReceiptUseCase {
  constructor(
    private repository: AccountsReceivableRepository,
    private factory: CustomerReceiptFactory
  ) {}

  async execute(command: { invoiceId: string, customerId: string, amount: number, receiptDate: string, currencyId: string, referenceNumber: string }): Promise<string> {
    const traceId = Tracer.generateTraceId();
    const endTimer = Metrics.startTimer('reconcile_ar_receipt');
    
    Logger.info(`Executing ReconcileARReceipt for Invoice ${command.invoiceId}`, { traceId, command });

    try {
      const invoice = await this.repository.getInvoiceById(command.invoiceId);
      if (!invoice) throw new Error(`Invoice ${command.invoiceId} not found`);

      const receipt = this.factory.createReceipt(
        command.customerId,
        command.invoiceId,
        command.amount,
        new Date(command.receiptDate),
        command.currencyId,
        command.referenceNumber
      );

      receipt.post();
      invoice.recordReceipt(command.amount);

      await this.repository.saveReceipt(receipt);
      await this.repository.saveInvoice(invoice);

      Logger.info(`Successfully recorded AR Receipt ${receipt.id}`, { traceId });
      Metrics.record('ar_receipt_amount', command.amount);
      
      endTimer();
      return traceId;
    } catch (error) {
      Logger.error('Failed to reconcile AR Receipt', error, { traceId });
      endTimer();
      throw error;
    }
  }
}
