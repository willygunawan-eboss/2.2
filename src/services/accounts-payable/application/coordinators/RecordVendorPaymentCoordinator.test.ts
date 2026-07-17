import { describe, it, expect, beforeEach } from 'vitest';
import { RecordVendorPaymentCoordinator } from './RecordVendorPaymentCoordinator';
import { VendorPaymentApplicationService } from '../VendorPaymentApplicationService';
import { VendorPaymentRepository } from '../../infrastructure/VendorPaymentRepository';
import { VendorPaymentFactory } from '../../domain/VendorPaymentFactory';
import { VendorInvoiceRepository } from '../../infrastructure/VendorInvoiceRepository';
import { VendorInvoiceFactory } from '../../domain/VendorInvoiceFactory';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { PostingService } from '../../../accounting/domain/PostingService';
import { AccountingFactory } from '../../../accounting/domain/AccountingFactory';

describe('RecordVendorPaymentCoordinator', () => {
  let coordinator: RecordVendorPaymentCoordinator;
  let paymentRepo: VendorPaymentRepository;
  let invoiceRepo: VendorInvoiceRepository;
  let accountingRepo: AccountingRepository;

  beforeEach(async () => {
    paymentRepo = new VendorPaymentRepository();
    invoiceRepo = new VendorInvoiceRepository();
    
    // Seed an invoice
    const invoiceFactory = new VendorInvoiceFactory();
    const invoice = invoiceFactory.createInvoice('V1', 'INV-200', new Date(), new Date(), 'USD');
    const line = invoiceFactory.createLine(invoice.id, 'Services', 1, 1000, 100, 'EXP-1');
    invoice.addLine(line);
    invoice.approve();
    invoice.post();
    await invoiceRepo.save(invoice);

    const paymentService = new VendorPaymentApplicationService(paymentRepo, invoiceRepo, new VendorPaymentFactory());
    
    accountingRepo = new AccountingRepository();
    const accountingFactory = new AccountingFactory();
    
    // Seed journal
    const cdj = accountingFactory.createJournal('CDJ', 'Cash Disbursements Journal');
    await accountingRepo.saveJournal(cdj);

    const postingService = new PostingService(accountingRepo);
    const accountingService = new AccountingApplicationService(accountingRepo, postingService);

    coordinator = new RecordVendorPaymentCoordinator(
      paymentService,
      paymentRepo,
      accountingService,
      'AP-LIABILITY-ACC'
    );
  });

  it('should record partial payment and generate accounting event successfully', async () => {
    // Get the seeded invoice
    const invoices = (invoiceRepo as any).invoices.values();
    const invoiceArray = Array.from(invoices) as any[];
    const invoice = invoiceArray[0];

    const request = {
      vendorId: 'V1',
      invoiceId: invoice.id,
      amount: 500, // Partial payment of 1100 total
      paymentDate: new Date(),
      currencyId: 'USD',
      referenceNumber: 'CHK-1234',
      cashAccountId: 'CASH-1'
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(true);
    expect(result.data?.status).toBe('RECORDED_AND_POSTED');

    const payment = await paymentRepo.getById(result.data!.paymentId);
    expect(payment).not.toBeNull();
    expect(payment?.status).toBe('POSTED');

    const updatedInvoice = await invoiceRepo.getById(invoice.id);
    expect(updatedInvoice?.paidAmount).toBe(500);
    expect(updatedInvoice?.status).toBe('PARTIALLY_PAID');

    // Verify Accounting side
    // It should have generated a CDJ journal entry
    const entries = (accountingRepo as any).entries.values();
    const entryArray = Array.from(entries) as any[];
    expect(entryArray.length).toBe(1);
    
    const entry = entryArray[0];
    expect(entry.lines.length).toBe(2);
    expect(entry.status).toBe('POSTED');
  });

  it('should fail if payment exceeds outstanding balance', async () => {
    const invoices = (invoiceRepo as any).invoices.values();
    const invoiceArray = Array.from(invoices) as any[];
    const invoice = invoiceArray[0];

    const request = {
      vendorId: 'V1',
      invoiceId: invoice.id,
      amount: 1500, // Exceeds 1100 total
      paymentDate: new Date(),
      currencyId: 'USD',
      referenceNumber: 'CHK-1235',
      cashAccountId: 'CASH-1'
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('exceeds outstanding balance');
  });
});
