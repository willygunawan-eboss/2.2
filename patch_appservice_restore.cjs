const fs = require('fs');
let content = fs.readFileSync('src/services/organization/application/OrganizationApplicationService.ts', 'utf8');

const updatedRestore = `
  async restoreOrganization(id: string, actor: string): Promise<void> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new OrganizationNotFoundError(id);
    }

    if (org.parentId) {
       const parent = await this.repository.findById(org.parentId);
       if (parent && parent.isDeleted) {
         throw new InvalidOrganizationParentError("Cannot restore organization: Parent is deleted");
       }
    }

    org.restore();
    org.incrementVersion();
    await this.repository.update(org);
    
    await this.timelineService.recordTimeline(org.id, "RESTORED", actor);
    await this.auditService.recordAudit(org.id, "RESTORE", actor, { id: org.id });
    await this.eventPublisher.publish("OrganizationRestored", { id: org.id }, "TraceId-TBD");
  }
`;

content = content.replace(/async restoreOrganization.*\}[\s\n]*async getOrganization/s, updatedRestore + '\n  async getOrganization');
fs.writeFileSync('src/services/organization/application/OrganizationApplicationService.ts', content);
console.log("Patched application service restore");
