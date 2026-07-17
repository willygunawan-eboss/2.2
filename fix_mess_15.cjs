const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const missingTables = `
export const ticketCategories = sqliteTable("ticket_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const ticketSubCategories = sqliteTable("ticket_sub_categories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => ticketCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at"),
});

export const ticketPriorities = sqliteTable("ticket_priorities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const ticketImpacts = sqliteTable("ticket_impacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const ticketUrgencies = sqliteTable("ticket_urgencies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const ticketStatuses = sqliteTable("ticket_statuses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isClosed: integer("is_closed", { mode: 'boolean' }).default(false),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  statusId: text("status_id").references(() => ticketStatuses.id),
  priorityId: text("priority_id").references(() => ticketPriorities.id),
  impactId: text("impact_id").references(() => ticketImpacts.id),
  urgencyId: text("urgency_id").references(() => ticketUrgencies.id),
  categoryId: text("category_id").references(() => ticketCategories.id),
  subCategoryId: text("sub_category_id").references(() => ticketSubCategories.id),
  customerId: text("customer_id").references(() => customers.id),
  assignedTo: text("assigned_to").references(() => employees.id),
  reportedBy: text("reported_by"),
  assetId: text("asset_id").references(() => assets.id),
  ciId: text("ci_id").references(() => cis.id),
  expectedResolutionDate: text("expected_resolution_date"),
  actualResolutionDate: text("actual_resolution_date"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});
`;

code = code + '\n' + missingTables;
fs.writeFileSync(file, code);

