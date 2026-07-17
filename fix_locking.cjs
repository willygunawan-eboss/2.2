const fs = require('fs');

let schemaCode = fs.readFileSync('src/db/schema.ts', 'utf8');

// Add version to invoices if not exists
if (!schemaCode.includes('version: integer("version")')) {
  schemaCode = schemaCode.replace(
    /amountDue: integer\("amount_due"\)\.notNull\(\),/,
    'amountDue: integer("amount_due").notNull(),\n  version: integer("version").notNull().default(1),'
  );
  fs.writeFileSync('src/db/schema.ts', schemaCode);
}
