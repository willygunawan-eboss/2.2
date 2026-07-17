import { ICustomerReceiptRepository } from '../domain/ICustomerReceiptRepository';
import { ICustomerInvoiceRepository } from '../domain/ICustomerInvoiceRepository';
import { CustomerReceiptFactory } from '../domain/CustomerReceiptFactory';
import { CustomerReceiptError } from '../domain/CustomerReceiptError';
import { CustomerInvoiceError } from '../domain/CustomerInvoiceError';

export interface RecordCustomerReceiptDTO {
  customerId: string;
  invoiceId: string;
  amount: number;
  receiptDate: Date;
  currencyId: string;
  referenceNumber: string;
}

export class CustomerReceiptApplicationService {
  constructor(
    private receiptRepo: ICustomerReceiptRepository,
    private invoiceRepo: ICustomerInvoiceRepository,
    private factory: CustomerReceiptFactory
  ) {}

  public async recordReceipt(dto: RecordCustomerReceiptDTO): Promise<string> {
    const invoice = await this.invoiceRepo.getById(dto.invoiceId);
    if (!invoice) {
      throw new CustomerInvoiceError(`Invoice ${dto.invoiceId} not found`);
    }

    if (invoice.customerId !== dto.customerId) {
      throw new CustomerReceiptError("Invoice does not belong to the specified customer");
    }

    if (invoice.currencyId !== dto.currencyId) {
      throw new CustomerReceiptError("Receipt currency must match invoice currency");
    }

    // This will throw if amount > outstanding or invoice not POSTED/PARTIALLY_PAID
    invoice.recordReceipt(dto.amount);

    const receipt = this.factory.createReceipt(
      dto.customerId,
      dto.invoiceId,
      dto.amount,
      dto.receiptDate,
      dto.currencyId,
      dto.referenceNumber
    );

    // Save both invoice and receipt
    await this.invoiceRepo.save(invoice);
    await this.receiptRepo.save(receipt);

    return receipt.id;
  }

  public async markAsPosted(id: string): Promise<void> {
    const receipt = await this.receiptRepo.getById(id);
    if (!receipt) throw new CustomerReceiptError("Receipt not found");
    receipt.post();
    await this.receiptRepo.save(receipt);
  }
}
