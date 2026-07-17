const fs = require('fs');

// 1. Fix schema.ts
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// Fix leads
code = code.replace(
  /export const leads = sqliteTable\("leads", \{ id: text\("id"\)\.primaryKey\(\), name: text\("name"\)\.notNull\(\), isDeleted: integer\("is_deleted", \{ mode: 'boolean' \}\)\.default\(false\) \};\n/g,
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
});\n`
);

// Fix assets missing departmentId
code = code.replace(
  /locationId: text\("location_id"\)\.references\(\(\) => assetLocations\.id\),/g,
  `locationId: text("location_id").references(() => assetLocations.id),\n  departmentId: text("department_id").references(() => departments.id),`
);

// Fix positions missing jobId
code = code.replace(
  /departmentId: text\("department_id"\)\.references\(\(\) => departments\.id\),/g,
  `departmentId: text("department_id").references(() => departments.id),\n  jobId: text("job_id").references(() => jobs.id),`
);

// Fix cis duplicate property
code = code.replace(
  /contractId: text\("contract_id"\)\.references\(\(\) => contracts\.id\),\n\s*contractId: text\("contract_id"\)\.references\(\(\) => contracts\.id\),/g,
  `contractId: text("contract_id").references(() => contracts.id),`
);

fs.writeFileSync(file, code);

// 2. Fix seeder.ts
file = 'src/db/seeder.ts';
if (fs.existsSync(file)) {
  let seederCode = fs.readFileSync(file, 'utf8');
  seederCode = seederCode.replace(
    /\{ id: role\.id, groupId: adminGroup\.id, name: role\.name, description: role\.description, isSystem: true \}/g,
    `{ id: role.id, groupId: adminGroup.id, name: role.name, description: role.description, isSystem: true, code: "SYSTEM_" + role.id }`
  );
  // Also check if any other roles are missing code
  seederCode = seederCode.replace(
    /\{ id: role\.id, groupId: (.*?), name: role\.name, description: role\.description, isSystem: true \}/g,
    `{ id: role.id, groupId: $1, name: role.name, description: role.description, isSystem: true, code: "SYSTEM_" + role.id }`
  );
  fs.writeFileSync(file, seederCode);
}

// 3. Fix assetRoutes.ts
file = 'src/routes/assetRoutes.ts';
if (fs.existsSync(file)) {
  let assetCode = fs.readFileSync(file, 'utf8');
  assetCode = assetCode.replace(/customer: true,?/g, '');
  fs.writeFileSync(file, assetCode);
}

