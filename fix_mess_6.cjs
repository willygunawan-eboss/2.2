const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const addCode = `
export const slas = sqliteTable("slas", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priorityId: text("priority_id").references(() => ticketPriorities.id),
  responseTimeMinutes: integer("response_time_minutes").notNull(),
  resolutionTimeMinutes: integer("resolution_time_minutes").notNull(),
});
`;
code = code + '\n' + addCode;
fs.writeFileSync(file, code);

