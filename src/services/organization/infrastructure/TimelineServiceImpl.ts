import { ITimelineService } from "../application/ports/ITimelineService.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { v4 as uuidv4 } from "uuid";

export class TimelineServiceImpl implements ITimelineService {
  async recordTimeline(orgId: string, action: string, actor: string, newValue?: any, oldValue?: any, traceId?: string): Promise<void> {
    await db.insert(schema.orgTimeline).values({
      id: uuidv4(),
      orgId,
      action,
      newValueJson: newValue ? JSON.stringify(newValue) : null,
      oldValueJson: oldValue ? JSON.stringify(oldValue) : null,
      actor,
      traceId: traceId || uuidv4()
    });
  }
}
