export interface ITimelineService {
  recordTimeline(entityId: string, event: string, actor: string, details?: any): Promise<void>;
}
