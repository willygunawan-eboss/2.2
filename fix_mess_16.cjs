const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// Add details column to auditPermissions
code = code.replace(
  /export const auditPermissions = sqliteTable\("audit_permissions", \{[\s\S]*?timestamp: text\("timestamp"\)\.default\(sql`CURRENT_TIMESTAMP`\),\n\}\);/g,
  `export const auditPermissions = sqliteTable("audit_permissions", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details"),
  performedBy: text("performed_by").notNull(),
  timestamp: text("timestamp").default(sql\`CURRENT_TIMESTAMP\`),
});`
);

// Add code column to roles
code = code.replace(
  /export const roles = sqliteTable\("roles", \{\n  id: text\("id"\)\.primaryKey\(\),\n  name: text\("name"\)\.notNull\(\),/g,
  `export const roles = sqliteTable("roles", {\n  id: text("id").primaryKey(),\n  name: text("name").notNull(),\n  code: text("code"),`
);

// Add branchId column to customers
code = code.replace(
  /export const customers = sqliteTable\("customers", \{\n  id: text\("id"\)\.primaryKey\(\),\n  name: text\("name"\)\.notNull\(\),/g,
  `export const customers = sqliteTable("customers", {\n  id: text("id").primaryKey(),\n  branchId: text("branch_id").references(() => branches.id),\n  name: text("name").notNull(),`
);

// Activities table
const activitiesTable = `
export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  performedById: text("performed_by_id").references(() => employees.id),
  date: text("date").notNull(),
  action: text("action").notNull(),
  description: text("description"),
});
`;
code = code + '\n' + activitiesTable;


// Contract tables
const contractTables = `
export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  contractNumber: text("contract_number"),
  customerId: text("customer_id").references(() => customers.id),
  contractType: text("contract_type"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status"),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const contractServices = sqliteTable("contract_services", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractSlas = sqliteTable("contract_slas", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractCoverages = sqliteTable("contract_coverages", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractDevices = sqliteTable("contract_devices", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractBillings = sqliteTable("contract_billings", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractRenewals = sqliteTable("contract_renewals", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractApprovals = sqliteTable("contract_approvals", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});
`;
code = code + '\n' + contractTables;

fs.writeFileSync(file, code);

