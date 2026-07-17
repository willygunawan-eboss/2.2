const fs = require('fs');

let content = fs.readFileSync('src/services/organization/OrganizationEngine.ts', 'utf8');

// Replace standard creates to also emit events
if (!content.includes('processEvents')) {
  content = content.replace(
    'import * as schema from "../../db/schema.js";',
    'import * as schema from "../../db/schema.js";\nimport { v4 as uuidv4 } from "uuid";'
  );

  const eventHelper = `
  static async publishEvent(eventName: string, payload: any, traceId: string, correlationId?: string) {
    try {
      await db.insert(schema.processEvents).values({
        id: crypto.randomUUID(),
        eventName,
        traceId,
        correlationId: correlationId || crypto.randomUUID(),
        sourceModule: "OrganizationPlatform",
        payloadJson: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Failed to publish event:", e);
    }
  }
`;

  content = content.replace(
    'export class OrganizationBusinessEngine {',
    'export class OrganizationBusinessEngine {\n' + eventHelper
  );

  // In createOrganization
  content = content.replace(
    'return insertData;',
    'await this.publishEvent("OrganizationCreated", insertData, traceId);\n    return insertData;'
  );

  // In updateOrganization (Action = UPDATED, MOVED, etc.)
  content = content.replace(
    'return { ...existing, ...updateData };',
    `let eventName = "OrganizationUpdated";
    if (action === "MOVED") eventName = "OrganizationMoved";
    await this.publishEvent(eventName, { old: existing, new: updateData }, traceId);
    return { ...existing, ...updateData };`
  );

  // In deleteOrganization
  content = content.replace(
    'action: "DELETED",\n      actor\n    });',
    'action: "DELETED",\n      actor\n    });\n    await this.publishEvent("OrganizationDeleted", { id }, crypto.randomUUID());'
  );

  // In restoreOrganization
  content = content.replace(
    'action: "RESTORED",\n      actor\n    });',
    'action: "RESTORED",\n      actor\n    });\n    await this.publishEvent("OrganizationRestored", { id }, crypto.randomUUID());'
  );

  fs.writeFileSync('src/services/organization/OrganizationEngine.ts', content);
  console.log("Patched OrganizationEngine for Events");
}
