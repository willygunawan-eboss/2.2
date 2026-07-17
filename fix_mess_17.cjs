const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /accountManagerId: text\("account_manager_id"\)\.references\(\(\) => employees\.id\),\n    companyId: text\("company_id"\)\.references\(\(\) => companies\.id\),\n    companyId: text\("company_id"\)\.references\(\(\) => companies\.id\),/g,
  `accountManagerId: text("account_manager_id").references(() => employees.id),\n    branchId: text("branch_id").references(() => branches.id),\n    companyId: text("company_id").references(() => companies.id),`
);

fs.writeFileSync(file, code);

