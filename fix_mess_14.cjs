const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /import \{ relations \} from "drizzle-orm";\nexport const companiesRelations = relations\(companies, \(\{ many \}\) => \(\{/g,
  `export const companiesRelations = relations(companies, ({ many }) => ({`
);

code = code.replace(
  /import \{ relations, sql \} from "drizzle-orm";\nexport const ticketsRelations = relations\(tickets, \(\{ one, many \}\) => \(\{/g,
  `export const ticketsRelations = relations(tickets, ({ one, many }) => ({`
);


if(!code.includes('import { relations, sql } from "drizzle-orm";')){
    code = code.replace(
      /import \{ sql \} from "drizzle-orm";/,
      `import { relations, sql } from "drizzle-orm";`
    );
}

fs.writeFileSync(file, code);

