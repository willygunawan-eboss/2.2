const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const empAssignmentStr = `
export const empAssignment = sqliteTable("emp_assignment", {
  id: text("id").primaryKey(),
  employmentId: text("employment_id").notNull().references(() => empPlatform.id),
  organizationId: text("organization_id").notNull().references(() => orgPlatform.id),
  positionId: text("position_id").notNull().references(() => orgPlatform.id),
  managerId: text("manager_id").references(() => empPlatform.id),
  supervisorId: text("supervisor_id").references(() => empPlatform.id),
  effectiveDate: text("effective_date").notNull(),
  endDate: text("end_date"),
  status: text("status").notNull(), // ACTIVE, INACTIVE
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const empAssignmentRelations = relations(empAssignment, ({ one }) => ({
  employment: one(empPlatform, { fields: [empAssignment.employmentId], references: [empPlatform.id], relationName: "assignment_employment" }),
  organization: one(orgPlatform, { fields: [empAssignment.organizationId], references: [orgPlatform.id], relationName: "assignment_organization" }),
  position: one(orgPlatform, { fields: [empAssignment.positionId], references: [orgPlatform.id], relationName: "assignment_position" }),
  manager: one(empPlatform, { fields: [empAssignment.managerId], references: [empPlatform.id], relationName: "assignment_manager" }),
  supervisor: one(empPlatform, { fields: [empAssignment.supervisorId], references: [empPlatform.id], relationName: "assignment_supervisor" }),
}));
`;

content = content.replace('// ENTERPRISE ASSET DOMAIN', empAssignmentStr + '\n// ==========================================\n// ENTERPRISE ASSET DOMAIN');

if (!content.includes('assignments: many(empAssignment, { relationName: "assignment_employment" })')) {
  content = content.replace(
    'organization: one(orgPlatform, { fields: [empPlatform.organizationId], references: [orgPlatform.id] })',
    'organization: one(orgPlatform, { fields: [empPlatform.organizationId], references: [orgPlatform.id] }),\n  assignments: many(empAssignment, { relationName: "assignment_employment" })'
  );
}

fs.writeFileSync('src/db/schema.ts', content);
