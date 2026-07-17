const fs = require('fs');
const path = require('path');

const files = {
  'src/services/accounts-payable/domain/VendorInvoiceError.ts': `export class VendorInvoiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VendorInvoiceError';
  }
}
`,
  'src/services/accounts-payable/domain/VendorInvoiceLine.ts': `import { VendorInvoiceError } from './VendorInvoiceError';

export interface VendorInvoiceLineProps {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  accountId: string;
  costCenterId?: string;
}

export class VendorInvoiceLine {
  constructor(private props: VendorInvoiceLineProps) {
    if (props.quantity <= 0) throw new VendorInvoiceError("Quantity must be greater than zero");
    if (props.unitPrice < 0) throw new VendorInvoiceError("Unit price cannot be negative");
  }

  get id(): string { return this.props.id; }
  get invoiceId(): string { return this.props.invoiceId; }
  get description(): string { return this.props.description; }
  get quantity(): number { return this.props.quantity; }
  get unitPrice(): number { return this.props.unitPrice; }
  get taxAmount(): number { return this.props.taxAmount; }
  get accountId(): string { return this.props.accountId; }
  get costCenterId(): string | undefined { return this.props.costCenterId; }
  get totalAmount(): number { return (this.props.quantity * this.props.unitPrice) + this.props.taxAmount; }
}
`,
  'src/services/accounts-payable/domain/VendorInvoice.ts': `import { VendorInvoiceLine } from './VendorInvoiceLine';
import { VendorInvoiceError } from './VendorInvoiceError';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  VOIDED = 'VOIDED'
}

export interface VendorInvoiceProps {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currencyId: string;
  status: InvoiceStatus;
  lines: VendorInvoiceLine[];
}

export class VendorInvoice {
  constructor(private props: VendorInvoiceProps) {
    if (!props.lines) this.props.lines = [];
  }

  get id(): string { return this.props.id; }
  get vendorId(): string { return this.props.vendorId; }
  get invoiceNumber(): string { return this.props.invoiceNumber; }
  get invoiceDate(): Date { return this.props.invoiceDate; }
  get dueDate(): Date { return this.props.dueDate; }
  get currencyId(): string { return this.props.currencyId; }
  get status(): InvoiceStatus { return this.props.status; }
  get lines(): ReadonlyArray<VendorInvoiceLine> { return this.props.lines; }

  public addLine(line: VendorInvoiceLine): void {
    if (this.status !== InvoiceStatus.DRAFT) {
      throw new VendorInvoiceError("Cannot add lines to a non-draft invoice");
    }
    this.props.lines.push(line);
  }

  public getTotalAmount(): number {
    return this.props.lines.reduce((sum, line) => sum + line.totalAmount, 0);
  }

  public approve(): void {
    if (this.status !== InvoiceStatus.DRAFT && this.status !== InvoiceStatus.PENDING_APPROVAL) {
      throw new VendorInvoiceError("Invoice cannot be approved from current state");
    }
    this.props.status = InvoiceStatus.APPROVED;
  }

  public post(): void {
    if (this.status !== InvoiceStatus.APPROVED) {
      throw new VendorInvoiceError("Only approved invoices can be posted");
    }
    this.props.status = InvoiceStatus.POSTED;
  }
}
`,
  'src/services/accounts-payable/domain/IVendorInvoiceRepository.ts': `import { VendorInvoice } from './VendorInvoice';

export interface IVendorInvoiceRepository {
  save(invoice: VendorInvoice): Promise<void>;
  getById(id: string): Promise<VendorInvoice | null>;
  existsByVendorAndInvoiceNumber(vendorId: string, invoiceNumber: string): Promise<boolean>;
}
`,
  'src/services/accounts-payable/domain/VendorInvoiceFactory.ts': `import { VendorInvoice, InvoiceStatus } from './VendorInvoice';
import { VendorInvoiceLine } from './VendorInvoiceLine';
import { v4 as uuidv4 } from 'uuid';

export class VendorInvoiceFactory {
  createInvoice(vendorId: string, invoiceNumber: string, invoiceDate: Date, dueDate: Date, currencyId: string): VendorInvoice {
    return new VendorInvoice({
      id: uuidv4(),
      vendorId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      currencyId,
      status: InvoiceStatus.DRAFT,
      lines: []
    });
  }

  createLine(invoiceId: string, description: string, quantity: number, unitPrice: number, taxAmount: number, accountId: string, costCenterId?: string): VendorInvoiceLine {
    return new VendorInvoiceLine({
      id: uuidv4(),
      invoiceId,
      description,
      quantity,
      unitPrice,
      taxAmount,
      accountId,
      costCenterId
    });
  }
}
`,
  'src/services/accounts-payable/application/VendorInvoiceApplicationService.ts': `import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
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
      throw new VendorInvoiceError(\`Invoice number \${dto.invoiceNumber} already exists for vendor \${dto.vendorId}\`);
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
`,
  'src/services/accounts-payable/application/VendorInvoiceQueryService.ts': `import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
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
`,
  'src/services/accounts-payable/application/coordinators/RecordVendorInvoiceCoordinator.ts': `import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { VendorInvoiceApplicationService, RecordVendorInvoiceDTO } from '../VendorInvoiceApplicationService';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingEvent } from '../../../accounting/domain/AccountingEvent';
import { IVendorInvoiceRepository } from '../../domain/IVendorInvoiceRepository';

export interface RecordInvoiceResponse {
  invoiceId: string;
  status: string;
}

export class RecordVendorInvoiceCoordinator implements IProcessCoordinator<RecordVendorInvoiceDTO, RecordInvoiceResponse> {
  constructor(
    private invoiceService: VendorInvoiceApplicationService,
    private invoiceRepo: IVendorInvoiceRepository,
    private accountingService: AccountingApplicationService,
    private vendorPayableAccountId: string
  ) {}

  public async execute(request: RecordVendorInvoiceDTO, context: ProcessContext): Promise<ProcessResult<RecordInvoiceResponse>> {
    try {
      // 1. Record Invoice (Business Document)
      const invoiceId = await this.invoiceService.recordInvoice(request);
      const invoice = await this.invoiceRepo.getById(invoiceId);
      if (!invoice) throw new Error("Invoice creation failed");

      // 2. Prepare Accounting Event
      const payload = {
        invoiceId: invoice.id,
        vendorId: invoice.vendorId,
        payableAccountId: this.vendorPayableAccountId,
        currencyId: invoice.currencyId,
        totalAmount: invoice.getTotalAmount(),
        lines: invoice.lines.map(l => ({
          accountId: l.accountId,
          amount: l.totalAmount,
          costCenterId: l.costCenterId
        }))
      };

      const accountingEvent: AccountingEvent = {
        eventId: \`EV-AP-\${invoice.id}\`,
        eventType: 'VENDOR_INVOICE_RECORDED',
        occurredOn: new Date(),
        sourceDocumentId: invoice.id,
        sourceSystem: 'ACCOUNTS_PAYABLE',
        payload
      };

      // 3. Send to Accounting Platform
      await this.accountingService.processAccountingEvent(accountingEvent);

      // 4. Update Document Status
      await this.invoiceService.markAsPosted(invoice.id);

      return ProcessResult.success({
        invoiceId,
        status: 'RECORDED_AND_POSTED'
      });
    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
`,
  'src/services/accounts-payable/infrastructure/VendorInvoiceRepository.ts': `import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
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
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n');
}
console.log('Accounts Payable Platform files created successfully');
