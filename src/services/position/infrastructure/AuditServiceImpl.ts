import { IAuditService } from "../application/ports/IAuditService.js";
export class AuditServiceImpl implements IAuditService {
  async recordAudit(entityId: string, action: string, actor: string, changes?: any): Promise<void> {
    console.log(`[Audit - Position] ${action} on ${entityId} by ${actor}`, changes);
  }
}
