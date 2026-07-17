const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I also need to add missing fields for things I wiped
code = code.replace(
  /jobGradeId: text\("job_grade_id"\)/g,
  'sectionId: text("section_id").references(() => sections.id),\n  teamId: text("team_id").references(() => teams.id),\n  jobGradeId: text("job_grade_id")'
);

code = code.replace(
  /accountManagerId: text\("account_manager_id"\)\.references\(\(\) => employees\.id\),/g,
  'accountManagerId: text("account_manager_id").references(() => employees.id),\n  branchId: text("branch_id").references(() => branches.id),\n  companyId: text("company_id").references(() => companies.id),'
);

code = code.replace(
  /assetManagerId: text\("asset_manager_id"\)\.references\(\(\) => employees\.id\),/g,
  'assetManagerId: text("asset_manager_id").references(() => employees.id),\n  branchId: text("branch_id").references(() => branches.id),\n  companyId: text("company_id").references(() => companies.id),\n  divisionId: text("division_id").references(() => divisions.id),\n  departmentId: text("department_id").references(() => departments.id),'
);

code = code.replace(
  /branchId: text\("branch_id"\)\.references\(\(\) => branches\.id\),/g, ''
);

fs.writeFileSync(file, code);

