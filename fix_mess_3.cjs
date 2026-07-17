const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync('src/db/schema_broken.ts', 'utf8');

// I'll take the broken file and just add back the missing tables manually from the error
const addCode = `
export const roles = sqliteTable("roles", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  groupId: text("group_id").references(() => roleGroups.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  createdBy: text("created_by"),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
});

export const roleGroups = sqliteTable("role_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const permissions = sqliteTable("permissions", {
  id: text("id").primaryKey(),
  module: text("module").notNull(), // e.g., Dashboard, Ticket, Invoice
  action: text("action").notNull(), // e.g., View, Create, Update, Delete, Approve
  name: text("name").notNull(),
  description: text("description"),
});

export const rolePermissions = sqliteTable("role_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  permissionId: text("permission_id").notNull().references(() => permissions.id),
});

export const userRoles = sqliteTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  roleId: text("role_id").notNull().references(() => roles.id),
});

export const dataScopes = sqliteTable("data_scopes", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., Self, Department, Division, Branch, Company, Global
  description: text("description"),
  level: integer("level").notNull(), // lower means more restricted
});

export const roleDataScopes = sqliteTable("role_data_scopes", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  module: text("module").notNull(),
  scopeId: text("scope_id").notNull().references(() => dataScopes.id),
});

export const menuPermissions = sqliteTable("menu_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  menu: text("menu").notNull(), // e.g., Dashboard, CRM, Sales, etc.
});

export const approvalLevels = sqliteTable("approval_levels", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  module: text("module").notNull(), // e.g., Purchase, Invoice
  minAmount: integer("min_amount").notNull(),
  maxAmount: integer("max_amount"), // null means unlimited
  levelOrder: integer("level_order").notNull(),
});

export const auditPermissions = sqliteTable("audit_permissions", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").notNull(), // User who made the change
  action: text("action").notNull(), // e.g., GRANT_PERMISSION, REVOKE_PERMISSION, CHANGE_APPROVAL
  entityType: text("entity_type").notNull(), // e.g., Role, ApprovalLevel
  entityId: text("entity_id").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  timestamp: text("timestamp").notNull().default(sql\`CURRENT_TIMESTAMP\`),
  ipAddress: text("ip_address"),
});
`;

code = code + '\n' + addCode;
fs.writeFileSync(file, code);

