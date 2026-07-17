const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export const companiesRelations = relations\(companies, \(\{ many \}\) => \(\{/g,
  `import { relations } from "drizzle-orm";\nexport const companiesRelations = relations(companies, ({ many }) => ({`
);

fs.writeFileSync(file, code);

