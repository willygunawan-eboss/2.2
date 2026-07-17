const fs = require('fs');
const file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I will just add them back to positions, sections, teams, posPlatform, orgPlatform, jobPlatform, customers, contracts, assets, asset_locations etc? No, let me just add them precisely where they are missing by checking where TS complained.

// src/db/schema.ts(345,62): error TS2339: Property 'sectionId' does not exist on type '{ ... positions ... }
// It was positions. Let's fix positions.
code = code.replace(
  `  departmentId: text("department_id")
      .notNull()
      .references(() => departments.id),
    jobGradeId: text("job_grade_id")`,
  `  departmentId: text("department_id")
      .notNull()
      .references(() => departments.id),
    sectionId: text("section_id").references(() => sections.id),
    teamId: text("team_id").references(() => teams.id),
    jobGradeId: text("job_grade_id")`
);

// src/db/schema.ts(1400,24): error TS2339: Property 'branchId' does not exist on type '... customers ...'
code = code.replace(
  `    accountManagerId: text("account_manager_id").references(() => employees.id),
    // Legacy fields`,
  `    accountManagerId: text("account_manager_id").references(() => employees.id),
    branchId: text("branch_id").references(() => branches.id),
    companyId: text("company_id").references(() => companies.id),
    // Legacy fields`
);

// src/db/schema.ts(2391,24): error TS2339: Property 'branchId' does not exist on type '... contracts ...'
code = code.replace(
  `    accountManagerId: text("account_manager_id").references(() => employees.id),
    description: text("description"),`,
  `    accountManagerId: text("account_manager_id").references(() => employees.id),
    branchId: text("branch_id").references(() => branches.id),
    companyId: text("company_id").references(() => companies.id),
    description: text("description"),`
);

// src/db/schema.ts(2557,21): error TS2339: Property 'branchId' does not exist on type '... assets ...'
code = code.replace(
  `    teamId: text("team_id"),
    assetManagerId: text("asset_manager_id").references(() => employees.id),`,
  `    teamId: text("team_id"),
    assetManagerId: text("asset_manager_id").references(() => employees.id),
    companyId: text("company_id").references(() => companies.id),
    branchId: text("branch_id").references(() => branches.id),
    divisionId: text("division_id").references(() => divisions.id),
    departmentId: text("department_id").references(() => departments.id),`
);

// src/db/schema.ts(2610,31): error TS2339: Property 'branchId' does not exist on type '... asset_locations ...'
code = code.replace(
  `  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),`,
  `  description: text("description"),
  companyId: text("company_id").references(() => companies.id),
  branchId: text("branch_id").references(() => branches.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),`
);

fs.writeFileSync(file, code);
