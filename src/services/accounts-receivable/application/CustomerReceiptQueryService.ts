import { ICustomerReceiptRepository } from '../domain/ICustomerReceiptRepository';
import { CustomerReceipt } from '../domain/CustomerReceipt';

export class CustomerReceiptQueryService {
  constructor(private repository: ICustomerReceiptRepository) {}

  public async getReceipt(id: string): Promise<Record<string, unknown> | null> {
    const receipt = await this.repository.getById(id);
    if (!receipt) return null;
    return this.mapToDTO(receipt);
  }

  public async getAllReceipts(): Promise<Record<string, unknown>[]> {
    const receipts = await this.repository.getAll();
    return receipts.map(r => this.mapToDTO(r));
  }

  private mapToDTO(receipt: CustomerReceipt): Record<string, unknown> {
    return {
      id: receipt.id,
      customerId: receipt.customerId,
      invoiceId: receipt.invoiceId,
      amount: receipt.amount,
      receiptDate: receipt.receiptDate,
      currencyId: receipt.currencyId,
      referenceNumber: receipt.referenceNumber,
      status: receipt.status
    };
  }
}
