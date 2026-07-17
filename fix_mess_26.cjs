const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// Remove jobId from assets
code = code.replace(
  /departmentId: text\("department_id"\)\.references\(\(\) => departments\.id\),\n  jobId: text\("job_id"\)\.references\(\(\) => jobs\.id\),\n  jobId: text\("job_id"\)\.references\(\(\) => jobs\.id\),/g,
  `departmentId: text("department_id").references(() => departments.id),`
);

// Add jobId to positions properly
code = code.replace(
  /export const positions = sqliteTable\([\s\S]*?id: text\("id"\)\.primaryKey\(\), \/\/ UUID\n    code: text\("code"\)\.notNull\(\)\.unique\(\),\n    name: text\("name"\)\.notNull\(\),/g,
  `export const positions = sqliteTable(
  "positions",
  {
    id: text("id").primaryKey(), // UUID
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    jobId: text("job_id").references(() => jobs.id),`
);

fs.writeFileSync(file, code);

