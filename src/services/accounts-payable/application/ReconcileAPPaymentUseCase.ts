import { AccountsPayableRepository } from '../infrastructure/AccountsPayableRepository';
import { VendorPaymentFactory } from '../domain/VendorPaymentFactory';
import { Logger } from '../../../platform/telemetry/Logger';
import { Metrics } from '../../../platform/telemetry/Metrics';
import { Tracer } from '../../../platform/telemetry/Tracer';

export class ReconcileAPPaymentUseCase {
  constructor(
    private repository: AccountsPayableRepository,
    private factory: VendorPaymentFactory
  ) {}

  async execute(command: { invoiceId: string, vendorId: string, amount: number, paymentDate: string, currencyId: string, referenceNumber: string, cashAccountId: string }): Promise<string> {
    const traceId = Tracer.generateTraceId();
    const endTimer = Metrics.startTimer('reconcile_ap_payment');
    
    Logger.info(`Executing ReconcileAPPayment for Invoice ${command.invoiceId}`, { traceId, command });

    try {
      const invoice = await this.repository.getInvoiceById(command.invoiceId);
      if (!invoice) throw new Error(`Invoice ${command.invoiceId} not found`);

      const payment = this.factory.createPayment(
        command.vendorId,
        command.invoiceId,
        command.amount,
        new Date(command.paymentDate),
        command.currencyId,
        command.referenceNumber,
        command.cashAccountId
      );

      payment.post();
      invoice.recordPayment(command.amount);

      await this.repository.savePayment(payment);
      await this.repository.saveInvoice(invoice);

      Logger.info(`Successfully recorded AP Payment ${payment.id}`, { traceId });
      Metrics.record('ap_payment_amount', command.amount);
      
      endTimer();
      return traceId;
    } catch (error) {
      Logger.error('Failed to reconcile AP Payment', error, { traceId });
      endTimer();
      throw error;
    }
  }
}
