export interface IAuditService {
  recordAudit(entityId: string, action: string, actor: string, changes?: any): Promise<void>;
}
