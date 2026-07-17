import { ICustomerInvoiceRepository } from '../domain/ICustomerInvoiceRepository';
import { CustomerInvoice } from '../domain/CustomerInvoice';

export class CustomerInvoiceRepository implements ICustomerInvoiceRepository {
  private invoices: Map<string, CustomerInvoice> = new Map();

  async save(invoice: CustomerInvoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }

  async getById(id: string): Promise<CustomerInvoice | null> {
    return this.invoices.get(id) || null;
  }

  async existsByCustomerAndInvoiceNumber(customerId: string, invoiceNumber: string): Promise<boolean> {
    for (const invoice of Array.from(this.invoices.values())) {
      if (invoice.customerId === customerId && invoice.invoiceNumber === invoiceNumber) {
        return true;
      }
    }
    return false;
  }

  async getAll(): Promise<CustomerInvoice[]> {
    return Array.from(this.invoices.values());
  }
}
