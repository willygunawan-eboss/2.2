const fs = require('fs');
const path = require('path');

const files = {
  'src/services/general-ledger/application/ports/IAuditService.ts': `export interface IAuditService {
  log(action: string, entity: string, entityId: string, details: Record<string, unknown>, userId: string): Promise<void>;
}
`,
  'src/services/general-ledger/application/ports/ITimelineService.ts': `export interface ITimelineService {
  record(entity: string, entityId: string, event: string, timestamp: Date, metadata: Record<string, unknown>): Promise<void>;
}
`,
  'src/services/general-ledger/domain/events/FiscalPeriodClosedEvent.ts': `export interface FiscalPeriodClosedEvent {
  eventId: string;
  eventType: 'FISCAL_PERIOD_CLOSED';
  occurredOn: Date;
  payload: {
    calendarId: string;
    periodNumber: number;
    closedBy: string;
  };
}
`,
  'src/services/general-ledger/domain/events/FiscalPeriodReopenedEvent.ts': `export interface FiscalPeriodReopenedEvent {
  eventId: string;
  eventType: 'FISCAL_PERIOD_REOPENED';
  occurredOn: Date;
  payload: {
    calendarId: string;
    periodNumber: number;
    reopenedBy: string;
  };
}
`,
  'src/services/general-ledger/domain/ClosingPolicy.ts': `import { JournalEntry } from '../../accounting/domain/JournalEntry';
import { FiscalPeriod } from '../../master-data/domain/FiscalCalendar';
import { PostingDomainError } from './PostingDomainError';

export class ClosingPolicy {
  static canClosePeriod(period: FiscalPeriod, unpostedEntries: JournalEntry[]): void {
    if (period.isClosed) {
      throw new PostingDomainError(\`Period \${period.periodNumber} is already closed\`);
    }
    if (unpostedEntries.length > 0) {
      throw new PostingDomainError(\`Cannot close period \${period.periodNumber}. There are \${unpostedEntries.length} unposted journal entries.\`);
    }
  }

  static canReopenPeriod(period: FiscalPeriod): void {
    if (!period.isClosed) {
      throw new PostingDomainError(\`Period \${period.periodNumber} is already open\`);
    }
  }
}
`,
  'src/services/general-ledger/domain/ClosingValidator.ts': `import { FiscalCalendar } from '../../master-data/domain/FiscalCalendar';
import { PostingDomainError } from './PostingDomainError';

export class ClosingValidator {
  static validatePeriodExists(calendar: FiscalCalendar, periodNumber: number) {
    const period = calendar.periods.find(p => p.periodNumber === periodNumber);
    if (!period) {
      throw new PostingDomainError(\`Period \${periodNumber} does not exist in calendar \${calendar.id}\`);
    }
    return period;
  }
}
`,
  'src/services/general-ledger/application/FiscalPeriodClosingApplicationService.ts': `import { FiscalCalendar } from '../../master-data/domain/FiscalCalendar';
import { IMasterDataRepository } from '../../master-data/domain/IMasterDataRepository';
import { ClosingPolicy } from '../domain/ClosingPolicy';
import { ClosingValidator } from '../domain/ClosingValidator';
import { IAccountingRepository } from '../../accounting/domain/IAccountingRepository';

export class FiscalPeriodClosingApplicationService {
  constructor(
    private masterDataRepo: IMasterDataRepository,
    private accountingRepo: IAccountingRepository
  ) {}

  async closePeriod(calendarId: string, periodNumber: number): Promise<void> {
    const calendar = await this.masterDataRepo.getFiscalCalendar(calendarId);
    if (!calendar) throw new Error(\`Calendar \${calendarId} not found\`);

    const period = ClosingValidator.validatePeriodExists(calendar, periodNumber);
    
    const unpostedEntries = await this.accountingRepo.getUnpostedEntriesInDateRange(period.startDate, period.endDate);
    
    ClosingPolicy.canClosePeriod(period, unpostedEntries);

    calendar.closePeriod(periodNumber);
    await this.masterDataRepo.saveFiscalCalendar(calendar);
  }

  async reopenPeriod(calendarId: string, periodNumber: number): Promise<void> {
    const calendar = await this.masterDataRepo.getFiscalCalendar(calendarId);
    if (!calendar) throw new Error(\`Calendar \${calendarId} not found\`);

    const period = ClosingValidator.validatePeriodExists(calendar, periodNumber);
    
    ClosingPolicy.canReopenPeriod(period);

    calendar.reopenPeriod(periodNumber);
    await this.masterDataRepo.saveFiscalCalendar(calendar);
  }
}
`,
  'src/services/general-ledger/application/coordinators/FiscalPeriodClosingCoordinator.ts': `import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { FiscalPeriodClosingApplicationService } from '../FiscalPeriodClosingApplicationService';
import { IAuditService } from '../ports/IAuditService';
import { ITimelineService } from '../ports/ITimelineService';
import { v4 as uuidv4 } from 'uuid';

export interface ClosePeriodRequest {
  calendarId: string;
  periodNumber: number;
  userId: string;
}

export interface ClosePeriodResponse {
  calendarId: string;
  periodNumber: number;
  status: string;
}

export class FiscalPeriodClosingCoordinator implements IProcessCoordinator<ClosePeriodRequest, ClosePeriodResponse> {
  constructor(
    private closingService: FiscalPeriodClosingApplicationService,
    private auditService: IAuditService,
    private timelineService: ITimelineService,
    private eventPublisher: (event: any) => Promise<void>
  ) {}

  public async execute(request: ClosePeriodRequest, context: ProcessContext): Promise<ProcessResult<ClosePeriodResponse>> {
    try {
      // 1. Close period
      await this.closingService.closePeriod(request.calendarId, request.periodNumber);

      // 2. Audit
      await this.auditService.log('CLOSE_FISCAL_PERIOD', 'FiscalCalendar', request.calendarId, { periodNumber: request.periodNumber }, request.userId);

      // 3. Timeline
      await this.timelineService.record('FiscalCalendar', request.calendarId, 'FISCAL_PERIOD_CLOSED', new Date(), { periodNumber: request.periodNumber });

      // 4. Domain Event
      const event = {
        eventId: \`EV-GL-CLS-\${uuidv4()}\`,
        eventType: 'FISCAL_PERIOD_CLOSED',
        occurredOn: new Date(),
        payload: {
          calendarId: request.calendarId,
          periodNumber: request.periodNumber,
          closedBy: request.userId
        }
      };
      await this.eventPublisher(event);

      return ProcessResult.success({
        calendarId: request.calendarId,
        periodNumber: request.periodNumber,
        status: 'CLOSED'
      });
    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}
`,
  'src/services/general-ledger/application/coordinators/FiscalPeriodClosingCoordinator.test.ts': `import { describe, it, expect, beforeEach } from 'vitest';
import { FiscalPeriodClosingCoordinator } from './FiscalPeriodClosingCoordinator';
import { FiscalPeriodClosingApplicationService } from '../FiscalPeriodClosingApplicationService';
import { MasterDataRepository } from '../../../master-data/infrastructure/MasterDataRepository';
import { MasterDataFactory } from '../../../master-data/domain/MasterDataFactory';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { JournalEntry } from '../../../accounting/domain/JournalEntry';
import { v4 as uuidv4 } from 'uuid';

describe('FiscalPeriodClosingCoordinator', () => {
  let coordinator: FiscalPeriodClosingCoordinator;
  let masterDataRepo: MasterDataRepository;
  let accountingRepo: AccountingRepository;
  let auditLogs: any[] = [];
  let timelineEvents: any[] = [];
  let publishedEvents: any[] = [];

  beforeEach(async () => {
    masterDataRepo = new MasterDataRepository();
    accountingRepo = new AccountingRepository();
    
    const closingService = new FiscalPeriodClosingApplicationService(masterDataRepo, accountingRepo);

    auditLogs = [];
    timelineEvents = [];
    publishedEvents = [];

    const auditService = {
      log: async (action: string, entity: string, entityId: string, details: any, userId: string) => {
        auditLogs.push({ action, entity, entityId, details, userId });
      }
    };

    const timelineService = {
      record: async (entity: string, entityId: string, event: string, timestamp: Date, metadata: any) => {
        timelineEvents.push({ entity, entityId, event, timestamp, metadata });
      }
    };

    const eventPublisher = async (event: any) => {
      publishedEvents.push(event);
    };

    coordinator = new FiscalPeriodClosingCoordinator(closingService, auditService, timelineService, eventPublisher);

    // Setup Fiscal Calendar
    const factory = new MasterDataFactory();
    const periods = [
      { periodNumber: 1, startDate: new Date('2023-01-01'), endDate: new Date('2023-01-31'), isClosed: false },
      { periodNumber: 2, startDate: new Date('2023-02-01'), endDate: new Date('2023-02-28'), isClosed: false }
    ];
    const calendar = factory.createFiscalCalendar('CAL-2023', 2023, new Date('2023-01-01'), new Date('2023-12-31'), periods);
    await masterDataRepo.saveFiscalCalendar(calendar);
  });

  it('should successfully close a period when no unposted journals exist', async () => {
    const result = await coordinator.execute({ calendarId: 'CAL-2023', periodNumber: 1, userId: 'user1' }, {} as any);
    
    expect(result.isSuccess).toBe(true);
    expect(result.data?.status).toBe('CLOSED');

    const calendar = await masterDataRepo.getFiscalCalendar('CAL-2023');
    expect(calendar?.periods[0].isClosed).toBe(true);

    expect(auditLogs.length).toBe(1);
    expect(auditLogs[0].action).toBe('CLOSE_FISCAL_PERIOD');

    expect(timelineEvents.length).toBe(1);
    expect(timelineEvents[0].event).toBe('FISCAL_PERIOD_CLOSED');

    expect(publishedEvents.length).toBe(1);
    expect(publishedEvents[0].eventType).toBe('FISCAL_PERIOD_CLOSED');
  });

  it('should fail to close if unposted entries exist in period', async () => {
    // Add unposted entry
    const entry = new JournalEntry({
      id: uuidv4(),
      journalId: 'J1',
      entryDate: new Date('2023-01-15'),
      description: 'Test',
      currencyId: 'USD',
      status: 'DRAFT',
      lines: []
    });
    await accountingRepo.saveEntry(entry);

    const result = await coordinator.execute({ calendarId: 'CAL-2023', periodNumber: 1, userId: 'user1' }, {} as any);
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('unposted journal entries');
    
    expect(auditLogs.length).toBe(0);
  });

  it('should fail if period is already closed', async () => {
    const cal = await masterDataRepo.getFiscalCalendar('CAL-2023');
    cal!.closePeriod(1);
    await masterDataRepo.saveFiscalCalendar(cal!);

    const result = await coordinator.execute({ calendarId: 'CAL-2023', periodNumber: 1, userId: 'user1' }, {} as any);
    
    expect(result.isSuccess).toBe(false);
    expect(result.error).toContain('already closed');
  });
});
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n');
}
console.log('GL Closing files created successfully');
