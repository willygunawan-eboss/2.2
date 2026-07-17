export interface IAuditService {
  recordAudit(orgId: string, action: string, actor: string, changes: any): Promise<void>;
}
