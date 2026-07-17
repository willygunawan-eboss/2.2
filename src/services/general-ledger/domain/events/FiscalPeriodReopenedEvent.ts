export interface FiscalPeriodReopenedEvent {
  eventId: string;
  eventType: 'FISCAL_PERIOD_REOPENED';
  occurredOn: Date;
  payload: {
    calendarId: string;
    periodNumber: number;
    reopenedBy: string;
  };
}
