const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const addCode = `
export const ticketComments = sqliteTable("ticket_comments", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  createdBy: text("created_by").notNull().references(() => employees.id),
  comment: text("comment").notNull(),
  isInternal: integer("is_internal", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
});

export const ticketWorklogs = sqliteTable("ticket_worklogs", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  employeeId: text("employee_id").notNull().references(() => employees.id),
  timeSpentMinutes: integer("time_spent_minutes").notNull(),
  workDate: text("work_date").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
});

export const ticketAttachments = sqliteTable("ticket_attachments", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  createdBy: text("created_by").notNull().references(() => employees.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
});

export const ticketTimelines = sqliteTable("ticket_timelines", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  createdBy: text("created_by").notNull().references(() => employees.id),
  action: text("action").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
});

export const ticketWatchers = sqliteTable("ticket_watchers", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  employeeId: text("employee_id").notNull().references(() => employees.id),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const ticketTags = sqliteTable("ticket_tags", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  tagId: text("tag_id").notNull().references(() => tags.id),
});
`;

code = code + '\n' + addCode;
fs.writeFileSync(file, code);

