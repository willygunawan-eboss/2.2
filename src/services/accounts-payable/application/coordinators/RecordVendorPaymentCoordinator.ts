import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { VendorPaymentApplicationService, RecordVendorPaymentDTO } from '../VendorPaymentApplicationService';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingEvent } from '../../../accounting/domain/AccountingEvent';
import { IVendorPaymentRepository } from '../../domain/IVendorPaymentRepository';
import { VendorPaymentError } from '../../domain/VendorPaymentError';

export interface RecordPaymentResponse {
  paymentId: string;
  status: string;
}

export class RecordVendorPaymentCoordinator implements IProcessCoordinator<RecordVendorPaymentDTO, RecordPaymentResponse> {
  constructor(
    private paymentService: VendorPaymentApplicationService,
    private paymentRepo: IVendorPaymentRepository,
    private accountingService: AccountingApplicationService,
    private vendorPayableAccountId: string
  ) {}

  public async execute(request: RecordVendorPaymentDTO, context: ProcessContext): Promise<ProcessResult<RecordPaymentResponse>> {
    try {
      // 1. Record Payment (Business Document & State Update)
      const paymentId = await this.paymentService.recordPayment(request);
      const payment = await this.paymentRepo.getById(paymentId);
      if (!payment) throw new VendorPaymentError("Payment creation failed");

      // 2. Prepare Accounting Event
      const payload = {
        paymentId: payment.id,
        invoiceId: payment.invoiceId,
        vendorId: payment.vendorId,
        payableAccountId: this.vendorPayableAccountId,
        cashAccountId: payment.cashAccountId,
        currencyId: payment.currencyId,
        amount: payment.amount
      };

      const accountingEvent: AccountingEvent = {
        eventId: `EV-AP-PAY-${payment.id}`,
        eventType: 'VENDOR_PAYMENT_RECORDED',
        occurredOn: new Date(),
        sourceDocumentId: payment.id,
        sourceSystem: 'ACCOUNTS_PAYABLE',
        payload
      };

      // 3. Send to Accounting Platform
      await this.accountingService.processAccountingEvent(accountingEvent);

      // 4. Update Document Status
      await this.paymentService.markAsPosted(payment.id);

      return ProcessResult.success({
        paymentId,
        status: 'RECORDED_AND_POSTED'
      });
    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
