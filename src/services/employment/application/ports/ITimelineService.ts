export interface ITimelineService {
  recordTimeline(employmentId: string, action: string, actor: string, details?: any, oldValue?: any): Promise<void>;
}
