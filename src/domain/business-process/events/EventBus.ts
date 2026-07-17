import { EventPayload } from '../types';

export class InternalEventBus {
  private static instance: InternalEventBus;
  private subscribers: Map<string, Array<(event: EventPayload) => Promise<void>>> = new Map();

  private constructor() {}

  public static getInstance(): InternalEventBus {
    if (!InternalEventBus.instance) {
      InternalEventBus.instance = new InternalEventBus();
    }
    return InternalEventBus.instance;
  }

  public subscribe(eventName: string, handler: (event: EventPayload) => Promise<void>) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    this.subscribers.get(eventName)!.push(handler);
  }

  public async publish(event: EventPayload): Promise<void> {
    console.log(`[EventBus] Publishing event: ${event.eventName} [TraceID: ${event.traceId}]`);
    const handlers = this.subscribers.get(event.eventName) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EventBus] Error handling event ${event.eventName}:`, err);
      }
    }
  }
}

export const eventBus = InternalEventBus.getInstance();
