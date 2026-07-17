export interface IAuditService {
  log(action: string, entity: string, entityId: string, details: Record<string, unknown>, userId: string): Promise<void>;
}
