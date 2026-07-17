const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Leads
code = code.replace(
  /export const leads = sqliteTable\("leads", \{\s*id: text\("id"\)\.primaryKey\(\),\s*name: text\("name"\)\.notNull\(\),\s*isDeleted: integer\("is_deleted", \{ mode: 'boolean' \}\)\.default\(false\)\s*\}\);/g,
  `export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  companyName: text("company_name"),
  pic: text("pic"),
  email: text("email"),
  phone: text("phone"),
  productInterest: text("product_interest"),
  source: text("source"),
  status: text("status"),
  score: integer("score"),
  ownerId: text("owner_id").references(() => employees.id),
  estimatedValue: real("estimated_value"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`)
});`
);

// 2. Positions jobId
code = code.replace(
  /departmentId: text\("department_id"\).references\(\(\) => departments\.id\),/g,
  `departmentId: text("department_id").references(() => departments.id),\n  jobId: text("job_id").references(() => jobs.id),`
);

fs.writeFileSync(file, code);

// 3. Seeder code
file = 'src/db/seeder.ts';
if (fs.existsSync(file)) {
  let seederCode = fs.readFileSync(file, 'utf8');
  seederCode = seederCode.replace(
    /\{ id: (.*?), groupId: (.*?), name: (.*?), description: (.*?), isSystem: true \}/g,
    `{ id: $1, groupId: $2, name: $3, description: $4, isSystem: true, code: "SYSTEM_" + $1 }`
  );
  fs.writeFileSync(file, seederCode);
}

// 4. AssetRoutes contract
file = 'src/routes/assetRoutes.ts';
if (fs.existsSync(file)) {
  let assetCode = fs.readFileSync(file, 'utf8');
  assetCode = assetCode.replace(/contract: true,?/g, '');
  fs.writeFileSync(file, assetCode);
}

