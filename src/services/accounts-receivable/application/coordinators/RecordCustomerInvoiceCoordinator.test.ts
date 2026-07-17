import { describe, it, expect, beforeEach } from 'vitest';
import { RecordCustomerInvoiceCoordinator } from './RecordCustomerInvoiceCoordinator';
import { CustomerInvoiceApplicationService } from '../CustomerInvoiceApplicationService';
import { CustomerInvoiceRepository } from '../../infrastructure/CustomerInvoiceRepository';
import { CustomerInvoiceFactory } from '../../domain/CustomerInvoiceFactory';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { PostingService } from '../../../accounting/domain/PostingService';
import { AccountingFactory } from '../../../accounting/domain/AccountingFactory';

describe('RecordCustomerInvoiceCoordinator', () => {
  let coordinator: RecordCustomerInvoiceCoordinator;
  let invoiceRepo: CustomerInvoiceRepository;
  let accountingRepo: AccountingRepository;

  beforeEach(async () => {
    invoiceRepo = new CustomerInvoiceRepository();
    const invoiceService = new CustomerInvoiceApplicationService(invoiceRepo, new CustomerInvoiceFactory());
    
    accountingRepo = new AccountingRepository();
    const accountingFactory = new AccountingFactory();
    
    // Seed journal
    const sj = accountingFactory.createJournal('SJ', 'Sales Journal');
    await accountingRepo.saveJournal(sj);

    const postingService = new PostingService(accountingRepo);
    const accountingService = new AccountingApplicationService(accountingRepo, postingService);

    coordinator = new RecordCustomerInvoiceCoordinator(
      invoiceService,
      invoiceRepo,
      accountingService,
      'AR-ASSET-ACC'
    );
  });

  it('should record invoice and generate accounting event successfully', async () => {
    const request = {
      customerId: 'CUST-1',
      invoiceNumber: 'INV-100',
      invoiceDate: new Date(),
      dueDate: new Date(),
      currencyId: 'USD',
      lines: [
        {
          description: 'Consulting Services',
          quantity: 10,
          unitPrice: 150,
          taxAmount: 0,
          revenueAccountId: 'REV-1'
        },
        {
          description: 'Software License',
          quantity: 1,
          unitPrice: 500,
          taxAmount: 50,
          revenueAccountId: 'REV-2'
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
    expect(invoice?.getTotalAmount()).toBe(2050); // 1500 + 550

    // Verify Accounting side
    const entries = (accountingRepo as any).entries.values();
    const entryArray = Array.from(entries) as any[];
    expect(entryArray.length).toBe(1);
    
    const entry = entryArray[0];
    expect(entry.lines.length).toBe(3); // 1 AR Debit + 2 Revenue Credits
    expect(entry.status).toBe('POSTED');

    const debitLine = entry.lines.find((l: any) => l.accountType === 'ASSET');
    expect(debitLine.amount).toBe(2050);

    const creditLines = entry.lines.filter((l: any) => l.accountType === 'REVENUE');
    expect(creditLines.length).toBe(2);
  });
});
