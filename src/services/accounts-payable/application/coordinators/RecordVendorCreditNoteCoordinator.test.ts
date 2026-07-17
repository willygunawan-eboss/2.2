import { describe, it, expect, beforeEach } from 'vitest';
import { RecordVendorCreditNoteCoordinator } from './RecordVendorCreditNoteCoordinator';
import { VendorCreditNoteApplicationService } from '../VendorCreditNoteApplicationService';
import { VendorCreditNoteRepository } from '../../infrastructure/VendorCreditNoteRepository';
import { VendorCreditNoteFactory } from '../../domain/VendorCreditNoteFactory';
import { VendorInvoiceRepository } from '../../infrastructure/VendorInvoiceRepository';
import { VendorInvoiceFactory } from '../../domain/VendorInvoiceFactory';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { PostingService } from '../../../accounting/domain/PostingService';
import { AccountingFactory } from '../../../accounting/domain/AccountingFactory';

describe('RecordVendorCreditNoteCoordinator', () => {
  let coordinator: RecordVendorCreditNoteCoordinator;
  let creditNoteRepo: VendorCreditNoteRepository;
  let invoiceRepo: VendorInvoiceRepository;
  let accountingRepo: AccountingRepository;

  beforeEach(async () => {
    creditNoteRepo = new VendorCreditNoteRepository();
    invoiceRepo = new VendorInvoiceRepository();
    
    // Seed an invoice
    const invoiceFactory = new VendorInvoiceFactory();
    const invoice = invoiceFactory.createInvoice('V1', 'INV-300', new Date(), new Date(), 'USD');
    const line = invoiceFactory.createLine(invoice.id, 'Faulty Goods', 1, 1000, 100, 'EXP-1');
    invoice.addLine(line);
    invoice.approve();
    invoice.post();
    await invoiceRepo.save(invoice);

    const creditNoteService = new VendorCreditNoteApplicationService(creditNoteRepo, invoiceRepo, new VendorCreditNoteFactory());
    
    accountingRepo = new AccountingRepository();
    const accountingFactory = new AccountingFactory();
    
    // Seed journal
    const gj = accountingFactory.createJournal('GJ', 'General Journal');
    await accountingRepo.saveJournal(gj);

    const postingService = new PostingService(accountingRepo);
    const accountingService = new AccountingApplicationService(accountingRepo, postingService);

    coordinator = new RecordVendorCreditNoteCoordinator(
      creditNoteService,
      creditNoteRepo,
      accountingService,
      'AP-LIABILITY-ACC'
    );
  });

  it('should record partial credit note and generate accounting event successfully', async () => {
    // Get the seeded invoice
    const invoices = (invoiceRepo as any).invoices.values();
    const invoiceArray = Array.from(invoices) as any[];
    const invoice = invoiceArray[0];

    const request = {
      vendorId: 'V1',
      invoiceId: invoice.id,
      amount: 400, // Partial credit of 1100 total
      creditDate: new Date(),
      currencyId: 'USD',
      referenceNumber: 'CN-1234',
      creditAccountId: 'RET-EXP-1'
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(true);
    expect(result.data?.status).toBe('RECORDED_AND_POSTED');

    const creditNote = await creditNoteRepo.getById(result.data!.creditNoteId);
    expect(creditNote).not.toBeNull();
    expect(creditNote?.status).toBe('POSTED');

    const updatedInvoice = await invoiceRepo.getById(invoice.id);
    expect(updatedInvoice?.creditedAmount).toBe(400);
    expect(updatedInvoice?.status).toBe('PARTIALLY_PAID'); // Treating credit as reduction in balance

    // Verify Accounting side
    // It should have generated a GJ journal entry
    const entries = (accountingRepo as any).entries.values();
    const entryArray = Array.from(entries) as any[];
    expect(entryArray.length).toBe(1);
    
    const entry = entryArray[0];
    expect(entry.lines.length).toBe(2);
    expect(entry.status).toBe('POSTED');
  });

  it('should fail if credit note exceeds outstanding balance', async () => {
    const invoices = (invoiceRepo as any).invoices.values();
    const invoiceArray = Array.from(invoices) as any[];
    const invoice = invoiceArray[0];

    const request = {
      vendorId: 'V1',
      invoiceId: invoice.id,
      amount: 1200, // Exceeds 1100 total
      creditDate: new Date(),
      currencyId: 'USD',
      referenceNumber: 'CN-1235',
      creditAccountId: 'RET-EXP-1'
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('exceeds outstanding balance');
  });
});
