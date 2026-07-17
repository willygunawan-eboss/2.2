import { IAuditService } from "../application/ports/IAuditService.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { v4 as uuidv4 } from "uuid";

export class AuditServiceImpl implements IAuditService {
  async recordAudit(orgId: string, action: string, actor: string, changes: any): Promise<void> {
    await db.insert(schema.orgAudit).values({
      id: uuidv4(),
      orgId,
      action,
      changesJson: JSON.stringify(changes),
      actor
    });
  }
}
