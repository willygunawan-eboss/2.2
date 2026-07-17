import { IVendorPaymentRepository } from '../domain/IVendorPaymentRepository';
import { VendorPayment } from '../domain/VendorPayment';

export class VendorPaymentRepository implements IVendorPaymentRepository {
  private payments: Map<string, VendorPayment> = new Map();

  async save(payment: VendorPayment): Promise<void> {
    this.payments.set(payment.id, payment);
  }

  async getById(id: string): Promise<VendorPayment | null> {
    return this.payments.get(id) || null;
  }

  async getByInvoiceId(invoiceId: string): Promise<VendorPayment[]> {
    return Array.from(this.payments.values()).filter(p => p.invoiceId === invoiceId);
  }
}
