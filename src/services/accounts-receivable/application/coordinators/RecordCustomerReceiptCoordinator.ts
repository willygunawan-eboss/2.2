import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { CustomerReceiptApplicationService, RecordCustomerReceiptDTO } from '../CustomerReceiptApplicationService';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingEvent } from '../../../accounting/domain/AccountingEvent';
import { ICustomerReceiptRepository } from '../../domain/ICustomerReceiptRepository';

export interface RecordCustomerReceiptResponse {
  receiptId: string;
  status: string;
}

export class RecordCustomerReceiptCoordinator implements IProcessCoordinator<RecordCustomerReceiptDTO, RecordCustomerReceiptResponse> {
  constructor(
    private receiptService: CustomerReceiptApplicationService,
    private receiptRepo: ICustomerReceiptRepository,
    private accountingService: AccountingApplicationService,
    private customerReceivableAccountId: string,
    private cashAccountId: string
  ) {}

  public async execute(request: RecordCustomerReceiptDTO, context: ProcessContext): Promise<ProcessResult<RecordCustomerReceiptResponse>> {
    try {
      // 1. Record Receipt (Business Document) and update invoice
      const receiptId = await this.receiptService.recordReceipt(request);
      
      const receipt = await this.receiptRepo.getById(receiptId);
      if (!receipt) {
        throw new Error("Receipt creation failed");
      }

      // 2. Prepare Accounting Event
      const payload = {
        receiptId: receipt.id,
        customerId: receipt.customerId,
        invoiceId: receipt.invoiceId,
        receivableAccountId: this.customerReceivableAccountId,
        cashAccountId: this.cashAccountId,
        currencyId: receipt.currencyId,
        amount: receipt.amount
      };

      const accountingEvent: AccountingEvent = {
        eventId: `EV-AR-RCT-${receipt.id}`,
        eventType: 'CUSTOMER_RECEIPT_RECORDED',
        occurredOn: new Date(),
        sourceDocumentId: receipt.id,
        sourceSystem: 'ACCOUNTS_RECEIVABLE',
        payload
      };

      // 3. Send to Accounting Platform
      await this.accountingService.processAccountingEvent(accountingEvent);

      // 4. Update Document Status
      await this.receiptService.markAsPosted(receipt.id);

      return ProcessResult.success({
        receiptId,
        status: 'RECORDED_AND_POSTED'
      });

    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
