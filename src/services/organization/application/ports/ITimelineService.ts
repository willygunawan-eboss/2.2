export interface ITimelineService {
  recordTimeline(orgId: string, action: string, actor: string, newValue?: any, oldValue?: any, traceId?: string): Promise<void>;
}
