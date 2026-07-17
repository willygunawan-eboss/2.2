export interface IEventPublisher {
  publish(eventName: string, payload: any, traceId: string): Promise<void>;
}
