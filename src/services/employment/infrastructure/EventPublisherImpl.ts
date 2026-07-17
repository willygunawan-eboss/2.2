import { IEventPublisher } from "../application/ports/IEventPublisher.js";

export class EventPublisherImpl implements IEventPublisher {
  async publish(eventName: string, payload: any, traceId?: string): Promise<void> {
    console.log(`[EventPublisher] ${eventName} published`, { traceId, payload });
  }
}
