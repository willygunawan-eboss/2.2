export interface IAuditService {
  recordAudit(employmentId: string, action: string, actor: string, payload: any): Promise<void>;
}
