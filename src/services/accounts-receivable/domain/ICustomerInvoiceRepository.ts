import { CustomerInvoice } from './CustomerInvoice';

export interface ICustomerInvoiceRepository {
  save(invoice: CustomerInvoice): Promise<void>;
  getById(id: string): Promise<CustomerInvoice | null>;
  existsByCustomerAndInvoiceNumber(customerId: string, invoiceNumber: string): Promise<boolean>;
  getAll(): Promise<CustomerInvoice[]>;
}
