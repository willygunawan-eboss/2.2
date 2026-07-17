const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const posPlatformStr = `
// ==========================================
// ENTERPRISE POSITION DOMAIN (PHASE 3)
// ==========================================
export const posPlatform = sqliteTable("pos_platform", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  companyId: text("company_id").references(() => orgPlatform.id),
  jobGrade: text("job_grade"),
  jobFamily: text("job_family"),
  jobLevel: text("job_level"),
  employmentType: text("employment_type"), // E.g., PERMANENT, CONTRACT, ALL
  status: text("status").notNull().default("ACTIVE"),
  effectiveDate: text("effective_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const posPlatformRelations = relations(posPlatform, ({ one, many }) => ({
  company: one(orgPlatform, { fields: [posPlatform.companyId], references: [orgPlatform.id] })
}));
`;

content = content.replace('// ENTERPRISE ASSET DOMAIN', posPlatformStr + '\n// ==========================================\n// ENTERPRISE ASSET DOMAIN');

fs.writeFileSync('src/db/schema.ts', content);
