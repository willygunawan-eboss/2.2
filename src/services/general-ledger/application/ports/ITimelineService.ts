export interface ITimelineService {
  record(entity: string, entityId: string, event: string, timestamp: Date, metadata: Record<string, unknown>): Promise<void>;
}
