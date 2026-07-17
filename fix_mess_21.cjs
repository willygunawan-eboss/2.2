const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export const assetLocations = sqliteTable\("asset_locations", \{\s*id: text\("id"\)\.primaryKey\(\),\s*name: text\("name"\)\.notNull\(\),/g,
  `export const assetLocations = sqliteTable("asset_locations", {
  id: text("id").primaryKey(),
  branchId: text("branch_id").references(() => branches.id),
  name: text("name").notNull(),`
);

fs.writeFileSync(file, code);

