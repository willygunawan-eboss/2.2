const fs = require('fs');
const path = require('path');

const files = {
  'src/services/accounting/domain/AccountingDomainError.ts': `export class AccountingDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountingDomainError';
  }
}
`,
  'src/services/accounting/domain/AccountingEvent.ts': `export interface AccountingEvent {
  eventId: string;
  eventType: string; // e.g., 'INVOICE_CREATED', 'PAYMENT_RECEIVED'
  occurredOn: Date;
  sourceDocumentId: string;
  sourceSystem: string;
  payload: Record<string, any>;
}
`,
  'src/services/accounting/domain/JournalLine.ts': `import { AccountingDomainError } from './AccountingDomainError';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export interface JournalLineProps {
  id: string;
  accountId: string;
  accountType: AccountType;
  entryType: EntryType;
  amount: number;
  currencyId: string;
  costCenterId?: string;
  profitCenterId?: string;
  description?: string;
}

export class JournalLine {
  constructor(private props: JournalLineProps) {
    if (props.amount <= 0) {
      throw new AccountingDomainError("Journal line amount must be greater than zero.");
    }
  }

  get id(): string { return this.props.id; }
  get accountId(): string { return this.props.accountId; }
  get accountType(): AccountType { return this.props.accountType; }
  get entryType(): EntryType { return this.props.entryType; }
  get amount(): number { return this.props.amount; }
  get currencyId(): string { return this.props.currencyId; }
  get costCenterId(): string | undefined { return this.props.costCenterId; }
  get profitCenterId(): string | undefined { return this.props.profitCenterId; }
  get description(): string | undefined { return this.props.description; }
}
`,
  'src/services/accounting/domain/JournalEntry.ts': `import { JournalLine, EntryType } from './JournalLine';
import { AccountingDomainError } from './AccountingDomainError';

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  VOIDED = 'VOIDED'
}

export interface JournalEntryProps {
  id: string;
  journalId: string;
  entryDate: Date;
  sourceDocumentId?: string;
  description: string;
  status: JournalEntryStatus;
  lines: JournalLine[];
}

export class JournalEntry {
  constructor(private props: JournalEntryProps) {
    if (!props.lines) {
      this.props.lines = [];
    }
  }

  get id(): string { return this.props.id; }
  get journalId(): string { return this.props.journalId; }
  get entryDate(): Date { return this.props.entryDate; }
  get sourceDocumentId(): string | undefined { return this.props.sourceDocumentId; }
  get description(): string { return this.props.description; }
  get status(): JournalEntryStatus { return this.props.status; }
  get lines(): ReadonlyArray<JournalLine> { return this.props.lines; }

  public addLine(line: JournalLine): void {
    if (this.status !== JournalEntryStatus.DRAFT) {
      throw new AccountingDomainError("Cannot add lines to a non-draft journal entry.");
    }
    this.props.lines.push(line);
  }

  public validateBalance(): boolean {
    let totalDebit = 0;
    let totalCredit = 0;
    
    for (const line of this.props.lines) {
      if (line.entryType === EntryType.DEBIT) {
        totalDebit += line.amount;
      } else {
        totalCredit += line.amount;
      }
    }
    
    // In a real system, precision handling is needed here
    return Math.abs(totalDebit - totalCredit) < 0.001;
  }

  public post(): void {
    if (this.status !== JournalEntryStatus.DRAFT) {
      throw new AccountingDomainError("Only draft journal entries can be posted.");
    }
    if (!this.validateBalance()) {
      throw new AccountingDomainError("Journal entry is not balanced.");
    }
    this.props.status = JournalEntryStatus.POSTED;
  }

  public void(): void {
    if (this.status === JournalEntryStatus.VOIDED) {
      throw new AccountingDomainError("Journal entry is already voided.");
    }
    this.props.status = JournalEntryStatus.VOIDED;
  }
}
`,
  'src/services/accounting/domain/Journal.ts': `export interface JournalProps {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export class Journal {
  constructor(private props: JournalProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get isActive(): boolean { return this.props.isActive; }
}
`,
  'src/services/accounting/domain/JournalBuilder.ts': `import { JournalEntry, JournalEntryStatus } from './JournalEntry';
import { JournalLine, EntryType, AccountType } from './JournalLine';
import { v4 as uuidv4 } from 'uuid';
import { AccountingDomainError } from './AccountingDomainError';

export class JournalBuilder {
  private entry: JournalEntry;

  constructor(journalId: string, description: string, entryDate: Date = new Date(), sourceDocumentId?: string) {
    this.entry = new JournalEntry({
      id: uuidv4(),
      journalId,
      entryDate,
      sourceDocumentId,
      description,
      status: JournalEntryStatus.DRAFT,
      lines: []
    });
  }

  public addDebit(
    accountId: string, 
    accountType: AccountType, 
    amount: number, 
    currencyId: string, 
    costCenterId?: string, 
    profitCenterId?: string, 
    description?: string
  ): JournalBuilder {
    const line = new JournalLine({
      id: uuidv4(),
      accountId,
      accountType,
      entryType: EntryType.DEBIT,
      amount,
      currencyId,
      costCenterId,
      profitCenterId,
      description
    });
    this.entry.addLine(line);
    return this;
  }

  public addCredit(
    accountId: string, 
    accountType: AccountType, 
    amount: number, 
    currencyId: string, 
    costCenterId?: string, 
    profitCenterId?: string, 
    description?: string
  ): JournalBuilder {
    const line = new JournalLine({
      id: uuidv4(),
      accountId,
      accountType,
      entryType: EntryType.CREDIT,
      amount,
      currencyId,
      costCenterId,
      profitCenterId,
      description
    });
    this.entry.addLine(line);
    return this;
  }

  public build(): JournalEntry {
    if (!this.entry.validateBalance()) {
      throw new AccountingDomainError("Cannot build an unbalanced journal entry.");
    }
    return this.entry;
  }
}
`,
  'src/services/accounting/domain/PostingService.ts': `import { JournalEntry } from './JournalEntry';
import { IAccountingRepository } from './IAccountingRepository';
import { AccountingDomainError } from './AccountingDomainError';

export class PostingService {
  constructor(private repository: IAccountingRepository) {}

  public async postEntry(entry: JournalEntry): Promise<void> {
    if (!entry.validateBalance()) {
      throw new AccountingDomainError("Cannot post unbalanced entry.");
    }
    
    entry.post();
    
    // In future sprints, this would interact with Ledger
    // For now, we just save the posted state of the entry
    await this.repository.saveEntry(entry);
  }
}
`,
  'src/services/accounting/domain/IAccountingRepository.ts': `import { JournalEntry } from './JournalEntry';
import { Journal } from './Journal';

export interface IAccountingRepository {
  saveEntry(entry: JournalEntry): Promise<void>;
  getEntryById(id: string): Promise<JournalEntry | null>;
  
  saveJournal(journal: Journal): Promise<void>;
  getJournalById(id: string): Promise<Journal | null>;
  getJournalByCode(code: string): Promise<Journal | null>;
}
`,
  'src/services/accounting/domain/AccountingFactory.ts': `import { Journal } from './Journal';
import { v4 as uuidv4 } from 'uuid';

export class AccountingFactory {
  public createJournal(code: string, name: string, description?: string): Journal {
    return new Journal({
      id: uuidv4(),
      code,
      name,
      description,
      isActive: true
    });
  }
}
`,
  'src/services/accounting/application/AccountingApplicationService.ts': `import { IAccountingRepository } from '../domain/IAccountingRepository';
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
      throw new AccountingDomainError(\`Journal with code \${journalCode} not found for event \${event.eventType}\`);
    }

    // 2. Build Journal Entry based on Event Payload
    const builder = new JournalBuilder(
      journal.id,
      \`Auto-generated from \${event.eventType}: \${event.eventId}\`,
      event.occurredOn,
      event.sourceDocumentId
    );

    // This logic would ideally be strategy-based depending on the event type
    // Mocking the translation logic for demonstration
    if (event.eventType === 'INVOICE_CREATED') {
      const { customerAccountId, revenueAccountId, amount, currencyId } = event.payload;
      
      builder.addDebit(customerAccountId, AccountType.ASSET, amount, currencyId, undefined, undefined, 'Account Receivable');
      builder.addCredit(revenueAccountId, AccountType.REVENUE, amount, currencyId, undefined, undefined, 'Sales Revenue');
    } else {
      throw new AccountingDomainError(\`Unsupported event type: \${event.eventType}\`);
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
      'PAYMENT_RECEIVED': 'CRJ', // Cash Receipts Journal
      'PURCHASE_ORDER_RECEIVED': 'PJ', // Purchases Journal
    };
    return mapping[eventType] || 'GJ'; // General Journal as fallback
  }
}
`,
  'src/services/accounting/application/AccountingQueryService.ts': `import { IAccountingRepository } from '../domain/IAccountingRepository';
import { JournalEntry } from '../domain/JournalEntry';

export class AccountingQueryService {
  constructor(private repository: IAccountingRepository) {}

  public async getEntry(id: string): Promise<Record<string, unknown> | null> {
    const entry = await this.repository.getEntryById(id);
    if (!entry) return null;
    return this.mapEntryToDTO(entry);
  }

  private mapEntryToDTO(entry: JournalEntry): Record<string, unknown> {
    return {
      id: entry.id,
      journalId: entry.journalId,
      entryDate: entry.entryDate,
      sourceDocumentId: entry.sourceDocumentId,
      description: entry.description,
      status: entry.status,
      lines: entry.lines.map(line => ({
        id: line.id,
        accountId: line.accountId,
        accountType: line.accountType,
        entryType: line.entryType,
        amount: line.amount,
        currencyId: line.currencyId,
        costCenterId: line.costCenterId,
        profitCenterId: line.profitCenterId,
        description: line.description
      }))
    };
  }
}
`,
  'src/services/accounting/infrastructure/AccountingRepository.ts': `import { IAccountingRepository } from '../domain/IAccountingRepository';
import { JournalEntry } from '../domain/JournalEntry';
import { Journal } from '../domain/Journal';

// Mock repository for Architecture setup
export class AccountingRepository implements IAccountingRepository {
  private entries: Map<string, JournalEntry> = new Map();
  private journals: Map<string, Journal> = new Map();

  async saveEntry(entry: JournalEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async getEntryById(id: string): Promise<JournalEntry | null> {
    return this.entries.get(id) || null;
  }

  async saveJournal(journal: Journal): Promise<void> {
    this.journals.set(journal.id, journal);
  }

  async getJournalById(id: string): Promise<Journal | null> {
    return this.journals.get(id) || null;
  }

  async getJournalByCode(code: string): Promise<Journal | null> {
    for (const journal of Array.from(this.journals.values())) {
      if (journal.code === code) return journal;
    }
    return null;
  }
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n');
}
console.log('Accounting Platform files created successfully');
