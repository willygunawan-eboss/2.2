const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// The original file is severely messed up due to a bad replace.
code = code.replace(
  /export const ticketsRelations = relations\(tickets, \(\{ one, many \}\) => \(\{/g,
  `import { relations, sql } from "drizzle-orm";\nexport const ticketsRelations = relations(tickets, ({ one, many }) => ({`
);

fs.writeFileSync(file, code);

