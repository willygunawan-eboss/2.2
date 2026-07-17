import { IVendorPaymentRepository } from '../domain/IVendorPaymentRepository';
import { VendorPayment } from '../domain/VendorPayment';

export class VendorPaymentQueryService {
  constructor(private repository: IVendorPaymentRepository) {}

  public async getPayment(id: string): Promise<Record<string, unknown> | null> {
    const payment = await this.repository.getById(id);
    if (!payment) return null;
    return this.mapToDTO(payment);
  }
  
  public async getPaymentsByInvoiceId(invoiceId: string): Promise<Record<string, unknown>[]> {
    const payments = await this.repository.getByInvoiceId(invoiceId);
    return payments.map(p => this.mapToDTO(p));
  }

  private mapToDTO(payment: VendorPayment): Record<string, unknown> {
    return {
      id: payment.id,
      vendorId: payment.vendorId,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      currencyId: payment.currencyId,
      referenceNumber: payment.referenceNumber,
      status: payment.status,
      cashAccountId: payment.cashAccountId
    };
  }
}
