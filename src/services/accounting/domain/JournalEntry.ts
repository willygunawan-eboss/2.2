import { JournalLine, EntryType } from './JournalLine';
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
