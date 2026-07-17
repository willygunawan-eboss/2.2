import { ITimelineService } from "../application/ports/ITimelineService.js";
export class TimelineServiceImpl implements ITimelineService {
  async recordTimeline(entityId: string, event: string, actor: string, details?: any): Promise<void> {
    console.log(`[Timeline - Position] ${event} on ${entityId} by ${actor}`, details);
  }
}
