import { CustomerReceipt } from './CustomerReceipt';

export interface ICustomerReceiptRepository {
  save(receipt: CustomerReceipt): Promise<void>;
  getById(id: string): Promise<CustomerReceipt | null>;
  getAll(): Promise<CustomerReceipt[]>;
}
