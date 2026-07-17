import { ICustomerInvoiceRepository } from '../domain/ICustomerInvoiceRepository';
import { CustomerInvoice } from '../domain/CustomerInvoice';

export class CustomerInvoiceQueryService {
  constructor(private repository: ICustomerInvoiceRepository) {}

  public async getInvoice(id: string): Promise<Record<string, unknown> | null> {
    const invoice = await this.repository.getById(id);
    if (!invoice) return null;
    return this.mapToDTO(invoice);
  }

  public async getAllInvoices(): Promise<Record<string, unknown>[]> {
    const invoices = await this.repository.getAll();
    return invoices.map(inv => this.mapToDTO(inv));
  }

  private mapToDTO(invoice: CustomerInvoice): Record<string, unknown> {
    return {
      id: invoice.id,
      customerId: invoice.customerId,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currencyId: invoice.currencyId,
      status: invoice.status,
      totalAmount: invoice.getTotalAmount(),
      outstandingBalance: invoice.getOutstandingBalance(),
      lines: invoice.lines.map(line => ({ ...line }))
    };
  }
}
