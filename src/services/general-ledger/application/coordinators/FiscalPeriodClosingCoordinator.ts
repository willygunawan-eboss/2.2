import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
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
        eventId: `EV-GL-CLS-${uuidv4()}`,
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
