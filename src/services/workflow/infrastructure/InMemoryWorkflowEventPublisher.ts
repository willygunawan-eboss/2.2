import { IWorkflowEventPublisher } from "../application/ports/IWorkflowEventPublisher";

export class InMemoryWorkflowEventPublisher implements IWorkflowEventPublisher {
  async publish(eventName: string, payload: any, traceId?: string): Promise<void> {
    console.log(`[Workflow Event] ${eventName}`, { traceId, payload });
  }
}
