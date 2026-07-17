const fs = require('fs');
const path = require('path');

// 1. Append Schema
let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

const orgPlatformSchema = `
// ==========================================
// ENTERPRISE ORGANIZATION PLATFORM (CORE)
// ==========================================

export const orgPlatform = sqliteTable("org_platform", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // COMPANY, BRANCH, DIVISION, DEPARTMENT, SECTION, TEAM, POSITION
  level: integer("level").notNull().default(0), // Calculated Depth
  parentId: text("parent_id"), // References orgPlatform.id
  path: text("path"), // Materialized Path
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  effectiveDate: text("effective_date").default(sql\`CURRENT_TIMESTAMP\`),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by")
});

export const orgRelationships = sqliteTable("org_relationships", {
  id: text("id").primaryKey(),
  ancestorId: text("ancestor_id").notNull(),
  descendantId: text("descendant_id").notNull(),
  depth: integer("depth").notNull(),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`)
});

export const orgTimeline = sqliteTable("org_timeline", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  action: text("action").notNull(), // CREATED, UPDATED, MOVED, ACTIVATED, DEACTIVATED, RESTORED, DELETED
  oldValueJson: text("old_value_json"),
  newValueJson: text("new_value_json"),
  actor: text("actor").notNull(),
  traceId: text("trace_id"),
  correlationId: text("correlation_id"),
  timestamp: text("timestamp").default(sql\`CURRENT_TIMESTAMP\`)
});

export const orgAudit = sqliteTable("org_audit", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  action: text("action").notNull(),
  changesJson: text("changes_json"),
  actor: text("actor").notNull(),
  timestamp: text("timestamp").default(sql\`CURRENT_TIMESTAMP\`)
});

export const orgPlatformRelations = relations(orgPlatform, ({ one, many }) => ({
  parent: one(orgPlatform, { fields: [orgPlatform.parentId], references: [orgPlatform.id], relationName: "parent_child" }),
  children: many(orgPlatform, { relationName: "parent_child" })
}));
`;

if (!schema.includes('orgPlatform = sqliteTable')) {
  fs.writeFileSync('src/db/schema.ts', schema + '\n' + orgPlatformSchema);
  console.log("Appended Organization Platform Schema");
}
