const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// Fix duplicate contractId and slaId in cis
code = code.replace(
  /assetId: text\("asset_id"\)\.references\(\(\) => assets\.id\),\n  contractId: text\("contract_id"\)\.references\(\(\) => contracts\.id\),\n  slaId: text\("sla_id"\)\.references\(\(\) => slas\.id\),\n    projectId/g,
  `assetId: text("asset_id").references(() => assets.id),\n    projectId`
);

// Add referenceGroups and referenceValues
code += `\nexport const referenceGroups = sqliteTable("reference_groups", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isSystem: integer("is_system", { mode: 'boolean' }).default(false),
  sortOrder: integer("sort_order").default(0),
});\n\nexport const referenceValues = sqliteTable("reference_values", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => referenceGroups.id),
  code: text("code").notNull(),
  value: text("value").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  sortOrder: integer("sort_order").default(0),
});\n`;

fs.writeFileSync(file, code);
