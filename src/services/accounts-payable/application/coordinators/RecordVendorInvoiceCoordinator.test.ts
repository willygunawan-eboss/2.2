import { describe, it, expect, beforeEach } from 'vitest';
import { RecordVendorInvoiceCoordinator } from './RecordVendorInvoiceCoordinator';
import { VendorInvoiceApplicationService } from '../VendorInvoiceApplicationService';
import { VendorInvoiceRepository } from '../../infrastructure/VendorInvoiceRepository';
import { VendorInvoiceFactory } from '../../domain/VendorInvoiceFactory';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { PostingService } from '../../../accounting/domain/PostingService';
import { AccountingFactory } from '../../../accounting/domain/AccountingFactory';

describe('RecordVendorInvoiceCoordinator', () => {
  let coordinator: RecordVendorInvoiceCoordinator;
  let invoiceRepo: VendorInvoiceRepository;
  let accountingRepo: AccountingRepository;

  beforeEach(async () => {
    invoiceRepo = new VendorInvoiceRepository();
    const invoiceService = new VendorInvoiceApplicationService(invoiceRepo, new VendorInvoiceFactory());
    
    accountingRepo = new AccountingRepository();
    const accountingFactory = new AccountingFactory();
    
    // Seed journal
    const pj = accountingFactory.createJournal('PJ', 'Purchases Journal');
    await accountingRepo.saveJournal(pj);

    const postingService = new PostingService(accountingRepo);
    const accountingService = new AccountingApplicationService(accountingRepo, postingService);

    coordinator = new RecordVendorInvoiceCoordinator(
      invoiceService,
      invoiceRepo,
      accountingService,
      'AP-LIABILITY-ACC'
    );
  });

  it('should record invoice and generate accounting event successfully', async () => {
    const request = {
      vendorId: 'V1',
      invoiceNumber: 'INV-100',
      invoiceDate: new Date(),
      dueDate: new Date(),
      currencyId: 'USD',
      lines: [
        {
          description: 'Software License',
          quantity: 1,
          unitPrice: 1000,
          taxAmount: 100,
          accountId: 'EXP-1'
        }
      ]
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(true);
    expect(result.data?.status).toBe('RECORDED_AND_POSTED');

    const invoice = await invoiceRepo.getById(result.data!.invoiceId);
    expect(invoice).not.toBeNull();
    expect(invoice?.status).toBe('POSTED');
    expect(invoice?.getTotalAmount()).toBe(1100);

    // Verify Accounting side
    // It should have generated a PJ journal entry
    const entries = (accountingRepo as any).entries.values();
    const entryArray = Array.from(entries) as any[];
    expect(entryArray.length).toBe(1);
    
    const entry = entryArray[0];
    expect(entry.lines.length).toBe(2);
    expect(entry.status).toBe('POSTED'); // Because AccountingApplicationService calls postingService.postEntry
  });
});
