const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

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

fs.writeFileSync(file, code);

