import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
import { VendorInvoice } from '../domain/VendorInvoice';

export class VendorInvoiceRepository implements IVendorInvoiceRepository {
  private invoices: Map<string, VendorInvoice> = new Map();
  async save(invoice: VendorInvoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }
  async getById(id: string): Promise<VendorInvoice | null> {
    return this.invoices.get(id) || null;
  }
  async existsByVendorAndInvoiceNumber(vendorId: string, invoiceNumber: string): Promise<boolean> {
    for (const invoice of Array.from(this.invoices.values())) {
      if (invoice.vendorId === vendorId && invoice.invoiceNumber === invoiceNumber) {
        return true;
      }
    }
    return false;
  }
  async getAll(): Promise<VendorInvoice[]> {
    return Array.from(this.invoices.values());
  }
}
