import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { CustomerInvoiceApplicationService, CreateCustomerInvoiceDTO } from '../CustomerInvoiceApplicationService';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingEvent } from '../../../accounting/domain/AccountingEvent';
import { ICustomerInvoiceRepository } from '../../domain/ICustomerInvoiceRepository';

export interface RecordCustomerInvoiceResponse {
  invoiceId: string;
  status: string;
}

export class RecordCustomerInvoiceCoordinator implements IProcessCoordinator<CreateCustomerInvoiceDTO, RecordCustomerInvoiceResponse> {
  constructor(
    private invoiceService: CustomerInvoiceApplicationService,
    private invoiceRepo: ICustomerInvoiceRepository,
    private accountingService: AccountingApplicationService,
    private customerReceivableAccountId: string
  ) {}

  public async execute(request: CreateCustomerInvoiceDTO, context: ProcessContext): Promise<ProcessResult<RecordCustomerInvoiceResponse>> {
    try {
      // 1. Create and Approve Invoice
      const invoiceId = await this.invoiceService.createInvoice(request);
      await this.invoiceService.approveInvoice(invoiceId);

      // 2. Fetch the updated invoice
      const invoice = await this.invoiceRepo.getById(invoiceId);
      if (!invoice) {
        throw new Error("Invoice creation failed");
      }

      // 3. Prepare Accounting Event
      const payload = {
        invoiceId: invoice.id,
        customerId: invoice.customerId,
        receivableAccountId: this.customerReceivableAccountId,
        currencyId: invoice.currencyId,
        totalAmount: invoice.getTotalAmount(),
        lines: invoice.lines.map(l => ({
          accountId: l.revenueAccountId,
          amount: (l.quantity * l.unitPrice) + l.taxAmount,
        }))
      };

      const accountingEvent: AccountingEvent = {
        eventId: `EV-AR-INV-${invoice.id}`,
        eventType: 'CUSTOMER_INVOICE_RECORDED', // Reusing an existing pattern or we add this
        occurredOn: new Date(),
        sourceDocumentId: invoice.id,
        sourceSystem: 'ACCOUNTS_RECEIVABLE',
        payload
      };

      // 4. Send to Accounting Platform
      await this.accountingService.processAccountingEvent(accountingEvent);

      // 5. Mark as Posted
      await this.invoiceService.markAsPosted(invoiceId);

      return ProcessResult.success({
        invoiceId,
        status: 'RECORDED_AND_POSTED'
      });

    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
