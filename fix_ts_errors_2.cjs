const fs = require('fs');

// 1. schema.ts fixes
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// The replacement before might not have matched if indentation or formatting was slightly different. Let's do it precisely.
// Look for jobGradeId inside posPlatform definition
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

fs.writeFileSync(file, code);

// 2. Policy test and router fixes
file = 'src/services/policy/application/PolicyApplicationService.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /name: 'Test Policy',\n      description: 'A test policy'/g,
    "code: 'TEST_POLICY',\n      name: 'Test Policy',\n      description: 'A test policy'"
  );
  fs.writeFileSync(file, code);
}

file = 'src/services/policy/presentation/PolicyRouter.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /name: req\.body\.name,\n      description: req\.body\.description,/g,
    "code: req.body.code,\n      name: req.body.name,\n      description: req.body.description,"
  );
  fs.writeFileSync(file, code);
}


// 3. Test parameter argument fixes
file = 'src/services/workforce/application/MutateEmployeeUseCase.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /unitOfWorkMock,\n      eventPublisherMock,\n      policyServiceMock,\n      workflowServiceMock\n    \);/g,
    `unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      { recordAudit: async () => {} } as any,
      { recordTimeline: async () => {} } as any
    );`
  );
  fs.writeFileSync(file, code);
}

file = 'src/services/workforce/application/TransferEmployeeUseCase.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /unitOfWorkMock,\n      eventPublisherMock,\n      policyServiceMock,\n      workflowServiceMock\n    \);/g,
    `unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      { recordAudit: async () => {} } as any,
      { recordTimeline: async () => {} } as any
    );`
  );
  code = code.replace(/\{ recordAudit: vi\.fn\(\) \} as any,/g, '{ recordAudit: async () => {} } as any,');
  code = code.replace(/\{ recordTimeline: vi\.fn\(\) \} as any/g, '{ recordTimeline: async () => {} } as any');
  fs.writeFileSync(file, code);
}
