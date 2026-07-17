const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const jobArchitectureStr = `
// ==========================================
// ENTERPRISE JOB ARCHITECTURE DOMAIN (PHASE 3)
// ==========================================
export const jobFamily = sqliteTable("job_family", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const jobGrade = sqliteTable("job_grade", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const jobPlatform = sqliteTable("job_platform", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  jobFamilyId: text("job_family_id").notNull().references(() => jobFamily.id),
  jobGradeId: text("job_grade_id").notNull().references(() => jobGrade.id),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const jobFamilyRelations = relations(jobFamily, ({ many }) => ({
  jobs: many(jobPlatform)
}));

export const jobGradeRelations = relations(jobGrade, ({ many }) => ({
  jobs: many(jobPlatform)
}));

export const jobPlatformRelations = relations(jobPlatform, ({ one, many }) => ({
  jobFamily: one(jobFamily, { fields: [jobPlatform.jobFamilyId], references: [jobFamily.id] }),
  jobGrade: one(jobGrade, { fields: [jobPlatform.jobGradeId], references: [jobGrade.id] }),
  positions: many(posPlatform)
}));
`;

content = content.replace('// ==========================================\n// ENTERPRISE POSITION DOMAIN (PHASE 3)\n// ==========================================', jobArchitectureStr + '\n// ==========================================\n// ENTERPRISE POSITION DOMAIN (PHASE 3)\n// ==========================================');

// Now update posPlatform
content = content.replace(
  'jobGrade: text("job_grade"),\n  jobFamily: text("job_family"),\n  jobLevel: text("job_level"),',
  'jobId: text("job_id").references(() => jobPlatform.id),'
);

content = content.replace(
  'company: one(orgPlatform, { fields: [posPlatform.companyId], references: [orgPlatform.id] }),\n  assignments: many(empAssignment, { relationName: "assignment_position" })',
  'company: one(orgPlatform, { fields: [posPlatform.companyId], references: [orgPlatform.id] }),\n  job: one(jobPlatform, { fields: [posPlatform.jobId], references: [jobPlatform.id] }),\n  assignments: many(empAssignment, { relationName: "assignment_position" })'
);

fs.writeFileSync('src/db/schema.ts', content);
