import { VendorInvoice } from './VendorInvoice';

export interface IVendorInvoiceRepository {
  save(invoice: VendorInvoice): Promise<void>;
  getById(id: string): Promise<VendorInvoice | null>;
  existsByVendorAndInvoiceNumber(vendorId: string, invoiceNumber: string): Promise<boolean>;
  getAll(): Promise<VendorInvoice[]>;
}
