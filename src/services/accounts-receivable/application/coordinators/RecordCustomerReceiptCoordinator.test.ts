import { describe, it, expect, beforeEach } from 'vitest';
import { RecordCustomerReceiptCoordinator } from './RecordCustomerReceiptCoordinator';
import { CustomerReceiptApplicationService } from '../CustomerReceiptApplicationService';
import { CustomerReceiptRepository } from '../../infrastructure/CustomerReceiptRepository';
import { CustomerReceiptFactory } from '../../domain/CustomerReceiptFactory';
import { CustomerInvoiceRepository } from '../../infrastructure/CustomerInvoiceRepository';
import { CustomerInvoiceFactory } from '../../domain/CustomerInvoiceFactory';
import { AccountingApplicationService } from '../../../accounting/application/AccountingApplicationService';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { PostingService } from '../../../accounting/domain/PostingService';
import { AccountingFactory } from '../../../accounting/domain/AccountingFactory';

describe('RecordCustomerReceiptCoordinator', () => {
  let coordinator: RecordCustomerReceiptCoordinator;
  let receiptRepo: CustomerReceiptRepository;
  let invoiceRepo: CustomerInvoiceRepository;
  let accountingRepo: AccountingRepository;

  beforeEach(async () => {
    receiptRepo = new CustomerReceiptRepository();
    invoiceRepo = new CustomerInvoiceRepository();
    
    // Seed an invoice
    const invoiceFactory = new CustomerInvoiceFactory();
    const invoice = invoiceFactory.createInvoice('CUST-1', 'INV-100', new Date(), new Date(), 'USD');
    const line = invoiceFactory.createLine('Consulting', 10, 150, 0, 'REV-1');
    invoice.addLine(line);
    invoice.approve();
    invoice.post();
    await invoiceRepo.save(invoice);

    const receiptService = new CustomerReceiptApplicationService(receiptRepo, invoiceRepo, new CustomerReceiptFactory());
    
    accountingRepo = new AccountingRepository();
    const accountingFactory = new AccountingFactory();
    
    // Seed journal
    const crj = accountingFactory.createJournal('CRJ', 'Cash Receipts Journal');
    await accountingRepo.saveJournal(crj);

    const postingService = new PostingService(accountingRepo);
    const accountingService = new AccountingApplicationService(accountingRepo, postingService);

    coordinator = new RecordCustomerReceiptCoordinator(
      receiptService,
      receiptRepo,
      accountingService,
      'AR-ASSET-ACC',
      'CASH-ASSET-ACC'
    );
  });

  it('should record partial receipt and generate accounting event successfully', async () => {
    // Get the seeded invoice
    const invoices = (invoiceRepo as any).invoices.values();
    const invoiceArray = Array.from(invoices) as any[];
    const invoice = invoiceArray[0];

    const request = {
      customerId: 'CUST-1',
      invoiceId: invoice.id,
      amount: 500, // Partial payment of 1500 total
      receiptDate: new Date(),
      currencyId: 'USD',
      referenceNumber: 'REF-1234'
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(true);
    expect(result.data?.status).toBe('RECORDED_AND_POSTED');

    const receipt = await receiptRepo.getById(result.data!.receiptId);
    expect(receipt).not.toBeNull();
    expect(receipt?.status).toBe('POSTED');

    const updatedInvoice = await invoiceRepo.getById(invoice.id);
    expect(updatedInvoice?.paidAmount).toBe(500);
    expect(updatedInvoice?.status).toBe('PARTIALLY_PAID');

    // Verify Accounting side
    // It should have generated a CRJ journal entry
    const entries = (accountingRepo as any).entries.values();
    const entryArray = Array.from(entries) as any[];
    expect(entryArray.length).toBe(1);
    
    const entry = entryArray[0];
    expect(entry.lines.length).toBe(2);
    expect(entry.status).toBe('POSTED');

    const debitLine = entry.lines.find((l: any) => l.accountId === 'CASH-ASSET-ACC');
    expect(debitLine.amount).toBe(500);
    expect(debitLine.accountType).toBe('ASSET'); // Cash is Asset

    const creditLine = entry.lines.find((l: any) => l.accountId === 'AR-ASSET-ACC');
    expect(creditLine.amount).toBe(500);
    expect(creditLine.accountType).toBe('ASSET'); // AR is Asset
  });

  it('should fail if receipt amount exceeds outstanding balance', async () => {
    const invoices = (invoiceRepo as any).invoices.values();
    const invoiceArray = Array.from(invoices) as any[];
    const invoice = invoiceArray[0];

    const request = {
      customerId: 'CUST-1',
      invoiceId: invoice.id,
      amount: 2000, // Exceeds 1500 total
      receiptDate: new Date(),
      currencyId: 'USD',
      referenceNumber: 'REF-999'
    };

    const ctx: any = {};
    const result = await coordinator.execute(request, ctx);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('exceeds outstanding balance');
  });
});
