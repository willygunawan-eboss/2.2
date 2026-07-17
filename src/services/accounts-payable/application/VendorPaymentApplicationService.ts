import { IVendorPaymentRepository } from '../domain/IVendorPaymentRepository';
import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
import { VendorPaymentFactory } from '../domain/VendorPaymentFactory';
import { VendorPaymentError } from '../domain/VendorPaymentError';
import { VendorInvoiceError } from '../domain/VendorInvoiceError';

export interface RecordVendorPaymentDTO {
  vendorId: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  currencyId: string;
  referenceNumber: string;
  cashAccountId: string;
}

export class VendorPaymentApplicationService {
  constructor(
    private paymentRepo: IVendorPaymentRepository,
    private invoiceRepo: IVendorInvoiceRepository,
    private factory: VendorPaymentFactory
  ) {}

  public async recordPayment(dto: RecordVendorPaymentDTO): Promise<string> {
    const invoice = await this.invoiceRepo.getById(dto.invoiceId);
    if (!invoice) throw new VendorInvoiceError("Invoice not found");
    if (invoice.vendorId !== dto.vendorId) throw new VendorPaymentError("Vendor mismatch");
    if (invoice.currencyId !== dto.currencyId) throw new VendorPaymentError("Currency mismatch");

    // Will throw if validation fails (e.g., amount > outstanding)
    try {
      invoice.recordPayment(dto.amount);
    } catch (e: any) {
      throw new VendorPaymentError(e.message);
    }

    const payment = this.factory.createPayment(
      dto.vendorId,
      dto.invoiceId,
      dto.amount,
      dto.paymentDate,
      dto.currencyId,
      dto.referenceNumber,
      dto.cashAccountId
    );

    await this.paymentRepo.save(payment);
    await this.invoiceRepo.save(invoice);

    return payment.id;
  }

  public async markAsPosted(id: string): Promise<void> {
    const payment = await this.paymentRepo.getById(id);
    if (!payment) throw new VendorPaymentError("Payment not found");
    payment.post();
    await this.paymentRepo.save(payment);
  }
}
