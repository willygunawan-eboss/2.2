const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export const permissions = sqliteTable\("permissions", \{\n  id: text\("id"\)\.primaryKey\(\),\n  name: text\("name"\)\.notNull\(\),/g,
  `export const permissions = sqliteTable("permissions", {\n  id: text("id").primaryKey(),\n  name: text("name").notNull(),\n  isSystem: integer("is_system", { mode: 'boolean' }).default(false),`
);

code = code.replace(
  /export const roles = sqliteTable\("roles", \{\n  id: text\("id"\)\.primaryKey\(\),\n  name: text\("name"\)\.notNull\(\),\n  code: text\("code"\)\.notNull\(\)\.unique\(\),/g,
  `export const roles = sqliteTable("roles", {\n  id: text("id").primaryKey(),\n  name: text("name").notNull(),\n  code: text("code").notNull().unique(),\n  isSystem: integer("is_system", { mode: 'boolean' }).default(false),`
);

fs.writeFileSync(file, code);

