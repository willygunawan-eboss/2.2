const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Move ticket tables before ticketRelations
const ticketTablesRegex = /\nexport const ticketCategories = sqliteTable\([\s\S]*?deletedBy: text\("deleted_by"\),\n\}\);\n/g;
const ticketTablesMatch = code.match(ticketTablesRegex);
if (ticketTablesMatch) {
  code = code.replace(ticketTablesRegex, '');
  const insertIndex = code.indexOf('export const ticketsRelations =');
  if (insertIndex !== -1) {
    code = code.slice(0, insertIndex) + ticketTablesMatch[0] + code.slice(insertIndex);
  } else {
    code = code + ticketTablesMatch[0];
  }
}

// 2. Add contractId, slaId to tickets
code = code.replace(
  /assetId: text\("asset_id"\)\.references\(\(\) => assets\.id\),/g,
  `assetId: text("asset_id").references(() => assets.id),\n  contractId: text("contract_id").references(() => contracts.id),\n  slaId: text("sla_id").references(() => slas.id),`
);

// 3. Fix jobs
if (!code.includes('export const jobs = sqliteTable')) {
  code += `\nexport const jobs = sqliteTable("jobs", { id: text("id").primaryKey(), name: text("name").notNull() });\n`;
}

// 4. Fix leads
if (!code.includes('export const leads = sqliteTable')) {
  code += `\nexport const leads = sqliteTable("leads", { id: text("id").primaryKey(), name: text("name").notNull(), isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false) });\n`;
}

// 5. Fix activities
code = code.replace(
  /export const activities = sqliteTable\("activities", \{[\s\S]*?description: text\("description"\),\n\}\);/g,
  `export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  performedById: text("performed_by_id").references(() => employees.id),
  date: text("date").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  type: text("type"),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
});`
);

// 6. Fix customers duplicate companyId
code = code.replace(
  /companyId: text\("company_id"\)\.references\(\(\) => companies\.id\),\n\s*companyId: text\("company_id"\)\.references\(\(\) => companies\.id\),/g,
  `companyId: text("company_id").references(() => companies.id),`
);

// 7. Fix seeder missing code for roles
let seederFile = 'src/db/seeder.ts';
if (fs.existsSync(seederFile)) {
  let seederCode = fs.readFileSync(seederFile, 'utf8');
  seederCode = seederCode.replace(
    /\{ id: role.id, groupId: adminGroup.id, name: role.name, description: role.description, isSystem: true \}/g,
    `{ id: role.id, groupId: adminGroup.id, name: role.name, description: role.description, isSystem: true, code: "SYSTEM_" + role.id }`
  );
  fs.writeFileSync(seederFile, seederCode);
}

fs.writeFileSync(file, code);

