import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
import { VendorInvoiceFactory } from '../domain/VendorInvoiceFactory';
import { VendorInvoiceError } from '../domain/VendorInvoiceError';

export interface RecordVendorInvoiceDTO {
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currencyId: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    accountId: string;
    costCenterId?: string;
  }>;
}

export class VendorInvoiceApplicationService {
  constructor(
    private repository: IVendorInvoiceRepository,
    private factory: VendorInvoiceFactory
  ) {}

  public async recordInvoice(dto: RecordVendorInvoiceDTO): Promise<string> {
    const exists = await this.repository.existsByVendorAndInvoiceNumber(dto.vendorId, dto.invoiceNumber);
    if (exists) {
      throw new VendorInvoiceError(`Invoice number ${dto.invoiceNumber} already exists for vendor ${dto.vendorId}`);
    }

    const invoice = this.factory.createInvoice(
      dto.vendorId,
      dto.invoiceNumber,
      dto.invoiceDate,
      dto.dueDate,
      dto.currencyId
    );

    for (const lineDto of dto.lines) {
      const line = this.factory.createLine(
        invoice.id,
        lineDto.description,
        lineDto.quantity,
        lineDto.unitPrice,
        lineDto.taxAmount,
        lineDto.accountId,
        lineDto.costCenterId
      );
      invoice.addLine(line);
    }

    if (invoice.getTotalAmount() <= 0) {
      throw new VendorInvoiceError("Invoice total amount must be greater than zero");
    }

    // Auto approve for simplicity, could be integrated with Workflow
    invoice.approve();

    await this.repository.save(invoice);
    return invoice.id;
  }

  public async markAsPosted(id: string): Promise<void> {
    const invoice = await this.repository.getById(id);
    if (!invoice) throw new VendorInvoiceError("Invoice not found");
    invoice.post();
    await this.repository.save(invoice);
  }
}
