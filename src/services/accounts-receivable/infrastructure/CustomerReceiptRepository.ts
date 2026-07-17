import { ICustomerReceiptRepository } from '../domain/ICustomerReceiptRepository';
import { CustomerReceipt } from '../domain/CustomerReceipt';

export class CustomerReceiptRepository implements ICustomerReceiptRepository {
  private receipts: Map<string, CustomerReceipt> = new Map();

  async save(receipt: CustomerReceipt): Promise<void> {
    this.receipts.set(receipt.id, receipt);
  }

  async getById(id: string): Promise<CustomerReceipt | null> {
    return this.receipts.get(id) || null;
  }

  async getAll(): Promise<CustomerReceipt[]> {
    return Array.from(this.receipts.values());
  }
}
