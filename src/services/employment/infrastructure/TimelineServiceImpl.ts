import { ITimelineService } from "../application/ports/ITimelineService.js";

export class TimelineServiceImpl implements ITimelineService {
  async recordTimeline(employmentId: string, action: string, actor: string, details?: any, oldValue?: any): Promise<void> {
    console.log(`[Timeline] ${action} on ${employmentId} by ${actor}`, { details, oldValue });
  }
}
