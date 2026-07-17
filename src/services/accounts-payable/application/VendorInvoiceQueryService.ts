import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
import { VendorInvoice } from '../domain/VendorInvoice';

export class VendorInvoiceQueryService {
  constructor(private repository: IVendorInvoiceRepository) {}

  public async getInvoice(id: string): Promise<Record<string, unknown> | null> {
    const invoice = await this.repository.getById(id);
    if (!invoice) return null;
    return this.mapToDTO(invoice);
  }

  private mapToDTO(invoice: VendorInvoice): Record<string, unknown> {
    return {
      id: invoice.id,
      vendorId: invoice.vendorId,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currencyId: invoice.currencyId,
      status: invoice.status,
      lines: invoice.lines.map(l => ({
        id: l.id,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        taxAmount: l.taxAmount,
        accountId: l.accountId,
        costCenterId: l.costCenterId,
        totalAmount: l.totalAmount
      })),
      totalAmount: invoice.getTotalAmount()
    };
  }
}
