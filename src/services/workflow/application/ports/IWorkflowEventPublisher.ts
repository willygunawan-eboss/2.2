export interface IWorkflowEventPublisher {
  publish(eventName: string, payload: any, traceId?: string): Promise<void>;
}
