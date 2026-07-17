import { IAccountingRepository } from '../domain/IAccountingRepository';
import { AccountingEvent } from '../domain/AccountingEvent';
import { JournalBuilder } from '../domain/JournalBuilder';
import { PostingService } from '../domain/PostingService';
import { AccountType } from '../domain/JournalLine';
import { AccountingDomainError } from '../domain/AccountingDomainError';

export class AccountingApplicationService {
  constructor(
    private repository: IAccountingRepository,
    private postingService: PostingService
  ) {}

  // This method converts a generic Accounting Event into a Journal Entry
  public async processAccountingEvent(event: AccountingEvent): Promise<void> {
    // 1. Resolve Journal based on Event Type
    const journalCode = this.mapEventToJournalCode(event.eventType);
    const journal = await this.repository.getJournalByCode(journalCode);
    if (!journal) {
      throw new AccountingDomainError(`Journal with code ${journalCode} not found for event ${event.eventType}`);
    }

    // 2. Build Journal Entry based on Event Payload
    const builder = new JournalBuilder(
      journal.id,
      `Auto-generated from ${event.eventType}: ${event.eventId}`,
      event.occurredOn,
      event.sourceDocumentId
    );

    // This logic would ideally be strategy-based depending on the event type
    // Mocking the translation logic for demonstration
    if (event.eventType === 'INVOICE_CREATED') {
      const { customerAccountId, revenueAccountId, amount, currencyId } = event.payload;
      
      builder.addDebit(customerAccountId, AccountType.ASSET, amount, currencyId, undefined, undefined, 'Account Receivable');
      builder.addCredit(revenueAccountId, AccountType.REVENUE, amount, currencyId, undefined, undefined, 'Sales Revenue');
    } else if (event.eventType === 'CUSTOMER_INVOICE_RECORDED') {
      const { receivableAccountId, currencyId, totalAmount, lines } = event.payload;
      
      builder.addDebit(receivableAccountId, AccountType.ASSET, totalAmount, currencyId, undefined, undefined, 'Accounts Receivable');
      for (const line of lines) {
        builder.addCredit(line.accountId, AccountType.REVENUE, line.amount, currencyId, undefined, undefined, 'Sales Revenue');
      }
    } else if (event.eventType === 'CUSTOMER_RECEIPT_RECORDED') {
      const { receivableAccountId, cashAccountId, currencyId, amount } = event.payload;
      
      builder.addDebit(cashAccountId, AccountType.ASSET, amount, currencyId, undefined, undefined, 'Cash Receipt');
      builder.addCredit(receivableAccountId, AccountType.ASSET, amount, currencyId, undefined, undefined, 'Accounts Receivable Settlement');
    } else if (event.eventType === 'VENDOR_INVOICE_RECORDED') {
      const { payableAccountId, currencyId, totalAmount, lines } = event.payload;
      
      for (const line of lines) {
        builder.addDebit(line.accountId, AccountType.EXPENSE, line.amount, currencyId, line.costCenterId, undefined, 'Vendor Expense');
      }
      builder.addCredit(payableAccountId, AccountType.LIABILITY, totalAmount, currencyId, undefined, undefined, 'Accounts Payable');
    } else if (event.eventType === 'VENDOR_PAYMENT_RECORDED') {
      const { payableAccountId, cashAccountId, currencyId, amount } = event.payload;
      builder.addDebit(payableAccountId, AccountType.LIABILITY, amount, currencyId, undefined, undefined, 'Accounts Payable Settlement');
      builder.addCredit(cashAccountId, AccountType.ASSET, amount, currencyId, undefined, undefined, 'Cash Disbursement');
    } else if (event.eventType === 'VENDOR_CREDIT_NOTE_RECORDED') {
      const { payableAccountId, creditAccountId, currencyId, amount } = event.payload;
      builder.addDebit(payableAccountId, AccountType.LIABILITY, amount, currencyId, undefined, undefined, 'Accounts Payable Reduction');
      builder.addCredit(creditAccountId, AccountType.EXPENSE, amount, currencyId, undefined, undefined, 'Vendor Credit Note / Return');
    } else {
      throw new AccountingDomainError(`Unsupported event type: ${event.eventType}`);
    }

    const entry = builder.build();

    // 3. Save as Draft or Post
    await this.repository.saveEntry(entry);
    
    // Depending on policy, we might post immediately
    await this.postingService.postEntry(entry);
  }

  private mapEventToJournalCode(eventType: string): string {
    const mapping: Record<string, string> = {
      'INVOICE_CREATED': 'SJ', // Sales Journal
      'CUSTOMER_INVOICE_RECORDED': 'SJ', // Sales Journal
      'PAYMENT_RECEIVED': 'CRJ', // Cash Receipts Journal
      'CUSTOMER_RECEIPT_RECORDED': 'CRJ', // Cash Receipts Journal
      'PURCHASE_ORDER_RECEIVED': 'PJ', // Purchases Journal
      'VENDOR_INVOICE_RECORDED': 'PJ', // Purchases Journal
      'VENDOR_PAYMENT_RECORDED': 'CDJ', // Cash Disbursements Journal
      'VENDOR_CREDIT_NOTE_RECORDED': 'GJ', // General Journal, or PJ if treated as purchase return
    };
    return mapping[eventType] || 'GJ'; // General Journal as fallback
  }
}
