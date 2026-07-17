import { describe, it, expect, beforeEach } from 'vitest';
import { FiscalPeriodClosingCoordinator } from './FiscalPeriodClosingCoordinator';
import { FiscalPeriodClosingApplicationService } from '../FiscalPeriodClosingApplicationService';
import { MasterDataRepository } from '../../../master-data/infrastructure/MasterDataRepository';
import { MasterDataFactory } from '../../../master-data/domain/MasterDataFactory';
import { AccountingRepository } from '../../../accounting/infrastructure/AccountingRepository';
import { JournalEntry, JournalEntryStatus } from '../../../accounting/domain/JournalEntry';
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
      status: JournalEntryStatus.DRAFT,
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
