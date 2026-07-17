export interface FiscalPeriodClosedEvent {
  eventId: string;
  eventType: 'FISCAL_PERIOD_CLOSED';
  occurredOn: Date;
  payload: {
    calendarId: string;
    periodNumber: number;
    closedBy: string;
  };
}
