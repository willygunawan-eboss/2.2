export interface IEventPublisher {
  publish(eventName: string, payload: any, traceId: string, correlationId?: string): Promise<void>;
}
