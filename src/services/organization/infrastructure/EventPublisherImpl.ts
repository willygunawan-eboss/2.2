import { IEventPublisher } from "../application/ports/IEventPublisher.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { v4 as uuidv4 } from "uuid";

export class EventPublisherImpl implements IEventPublisher {
  async publish(eventName: string, payload: any, traceId: string, correlationId?: string): Promise<void> {
    try {
      await db.insert(schema.processEvents).values({
        id: uuidv4(),
        eventName,
        traceId,
        correlationId: correlationId || uuidv4(),
        sourceModule: "OrganizationPlatform",
        payloadJson: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Failed to publish event:", e);
    }
  }
}
