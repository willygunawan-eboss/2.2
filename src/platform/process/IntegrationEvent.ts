export interface IntegrationEvent {
  eventId: string;
  eventName: string;
  occurredOn: Date;
  payload: any;
}
