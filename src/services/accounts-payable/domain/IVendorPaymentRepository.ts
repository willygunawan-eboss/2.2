import { VendorPayment } from './VendorPayment';

export interface IVendorPaymentRepository {
  save(payment: VendorPayment): Promise<void>;
  getById(id: string): Promise<VendorPayment | null>;
  getByInvoiceId(invoiceId: string): Promise<VendorPayment[]>;
}
