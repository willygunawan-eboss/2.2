import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { VendorInvoiceApplicationService, RecordVendorInvoiceDTO } from '../VendorInvoiceApplicationService';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingEvent } from '../../../accounting/domain/AccountingEvent';
import { IVendorInvoiceRepository } from '../../domain/IVendorInvoiceRepository';

export interface RecordInvoiceResponse {
  invoiceId: string;
  status: string;
}

export class RecordVendorInvoiceCoordinator implements IProcessCoordinator<RecordVendorInvoiceDTO, RecordInvoiceResponse> {
  constructor(
    private invoiceService: VendorInvoiceApplicationService,
    private invoiceRepo: IVendorInvoiceRepository,
    private accountingService: AccountingApplicationService,
    private vendorPayableAccountId: string
  ) {}

  public async execute(request: RecordVendorInvoiceDTO, context: ProcessContext): Promise<ProcessResult<RecordInvoiceResponse>> {
    try {
      // 1. Record Invoice (Business Document)
      const invoiceId = await this.invoiceService.recordInvoice(request);
      const invoice = await this.invoiceRepo.getById(invoiceId);
      if (!invoice) throw new Error("Invoice creation failed");

      // 2. Prepare Accounting Event
      const payload = {
        invoiceId: invoice.id,
        vendorId: invoice.vendorId,
        payableAccountId: this.vendorPayableAccountId,
        currencyId: invoice.currencyId,
        totalAmount: invoice.getTotalAmount(),
        lines: invoice.lines.map(l => ({
          accountId: l.accountId,
          amount: l.totalAmount,
          costCenterId: l.costCenterId
        }))
      };

      const accountingEvent: AccountingEvent = {
        eventId: `EV-AP-${invoice.id}`,
        eventType: 'VENDOR_INVOICE_RECORDED',
        occurredOn: new Date(),
        sourceDocumentId: invoice.id,
        sourceSystem: 'ACCOUNTS_PAYABLE',
        payload
      };

      // 3. Send to Accounting Platform
      await this.accountingService.processAccountingEvent(accountingEvent);

      // 4. Update Document Status
      await this.invoiceService.markAsPosted(invoice.id);

      return ProcessResult.success({
        invoiceId,
        status: 'RECORDED_AND_POSTED'
      });
    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
