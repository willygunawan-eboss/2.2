import { ICustomerInvoiceRepository } from '../domain/ICustomerInvoiceRepository';
import { CustomerInvoiceFactory } from '../domain/CustomerInvoiceFactory';
import { CustomerInvoiceError } from '../domain/CustomerInvoiceError';

export interface CreateCustomerInvoiceDTO {
  customerId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currencyId: string;
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    revenueAccountId: string;
  }[];
}

export class CustomerInvoiceApplicationService {
  constructor(
    private repository: ICustomerInvoiceRepository,
    private factory: CustomerInvoiceFactory
  ) {}

  public async createInvoice(dto: CreateCustomerInvoiceDTO): Promise<string> {
    const exists = await this.repository.existsByCustomerAndInvoiceNumber(dto.customerId, dto.invoiceNumber);
    if (exists) {
      throw new CustomerInvoiceError(`Invoice ${dto.invoiceNumber} already exists for this customer`);
    }

    const invoice = this.factory.createInvoice(
      dto.customerId,
      dto.invoiceNumber,
      dto.invoiceDate,
      dto.dueDate,
      dto.currencyId
    );

    for (const line of dto.lines) {
      invoice.addLine(this.factory.createLine(
        line.description,
        line.quantity,
        line.unitPrice,
        line.taxAmount,
        line.revenueAccountId
      ));
    }

    await this.repository.save(invoice);
    return invoice.id;
  }

  public async approveInvoice(id: string): Promise<void> {
    const invoice = await this.repository.getById(id);
    if (!invoice) throw new CustomerInvoiceError("Invoice not found");
    invoice.approve();
    await this.repository.save(invoice);
  }

  public async markAsPosted(id: string): Promise<void> {
    const invoice = await this.repository.getById(id);
    if (!invoice) throw new CustomerInvoiceError("Invoice not found");
    invoice.post();
    await this.repository.save(invoice);
  }
}
