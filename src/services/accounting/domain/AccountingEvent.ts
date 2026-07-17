export interface AccountingEvent {
  eventId: string;
  eventType: string; // e.g., 'INVOICE_CREATED', 'PAYMENT_RECEIVED'
  occurredOn: Date;
  sourceDocumentId: string;
  sourceSystem: string;
  payload: Record<string, any>;
}
