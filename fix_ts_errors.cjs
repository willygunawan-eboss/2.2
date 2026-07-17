const fs = require('fs');

// 1. Fix schema.ts missing fields
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I will just use regex to add missing fields where needed to avoid matching wrong blocks
// positions: sectionId, teamId missing
code = code.replace(
  `export const posPlatform = sqliteTable("positions", {`,
  `export const posPlatform = sqliteTable("positions", {\n  sectionId: text("section_id").references(() => sections.id),\n  teamId: text("team_id").references(() => teams.id),`
);

// customers: branchId, companyId missing
code = code.replace(
  `export const customers = sqliteTable("customers", {`,
  `export const customers = sqliteTable("customers", {\n  branchId: text("branch_id").references(() => branches.id),\n  companyId: text("company_id").references(() => companies.id),`
);

// contracts: branchId, companyId missing
code = code.replace(
  `export const contracts = sqliteTable("contracts", {`,
  `export const contracts = sqliteTable("contracts", {\n  branchId: text("branch_id").references(() => branches.id),\n  companyId: text("company_id").references(() => companies.id),`
);

// assets: branchId missing
code = code.replace(
  `export const assets = sqliteTable("assets", {`,
  `export const assets = sqliteTable("assets", {\n  branchId: text("branch_id").references(() => branches.id),`
);

// asset_locations: branchId missing
code = code.replace(
  `export const assetLocations = sqliteTable("asset_locations", {`,
  `export const assetLocations = sqliteTable("asset_locations", {\n  branchId: text("branch_id").references(() => branches.id),`
);

// employees: sectionId, teamId missing
code = code.replace(
  `export const employees = sqliteTable("employees", {`,
  `export const employees = sqliteTable("employees", {\n  sectionId: text("section_id").references(() => sections.id),\n  teamId: text("team_id").references(() => teams.id),`
);

fs.writeFileSync(file, code);

// 2. Fix EmployeeService
file = 'src/services/EmployeeService.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(/if \(validatedData\.managerEmployeeId === id\) {[\s\S]*?}/, '');
  code = code.replace(/if \(validatedData\.supervisorEmployeeId === id\) {[\s\S]*?}/, '');
  fs.writeFileSync(file, code);
}

// 3. Fix Policy Test and Router
file = 'src/services/policy/application/PolicyApplicationService.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /name: 'Test Policy',\n      description: 'A test policy',/g,
    "code: 'TEST_POLICY',\n      name: 'Test Policy',\n      description: 'A test policy',"
  );
  fs.writeFileSync(file, code);
}

file = 'src/services/policy/presentation/PolicyRouter.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /name: z\.string\(\)\.min\(1\),\n  description: z\.string\(\)/,
    "code: z.string().min(1),\n  name: z.string().min(1),\n  description: z.string()"
  );
  fs.writeFileSync(file, code);
}

// 4. Fix Tests (6 args vs 4 args)
file = 'src/services/workforce/application/MutateEmployeeUseCase.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /useCase = new MutateEmployeeUseCase\(\n      unitOfWorkMock,\n      eventPublisherMock,\n      policyServiceMock,\n      workflowServiceMock\n    \);/,
    `useCase = new MutateEmployeeUseCase(
      unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      { recordAudit: vi.fn() } as any,
      { recordTimeline: vi.fn() } as any
    );`
  );
  fs.writeFileSync(file, code);
}

file = 'src/services/workforce/application/TransferEmployeeUseCase.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /useCase = new TransferEmployeeUseCase\(\n      unitOfWorkMock,\n      eventPublisherMock,\n      policyServiceMock,\n      workflowServiceMock,\n      \{ recordAudit: async \(\) => \{\} \},\n      \{ recordTimeline: async \(\) => \{\} \}\n    \);/,
    `useCase = new TransferEmployeeUseCase(
      unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      { recordAudit: vi.fn() } as any,
      { recordTimeline: vi.fn() } as any
    );`
  );
  fs.writeFileSync(file, code);
}

// 5. Fix WorkforceRouter variable initialization order
file = 'src/services/workforce/presentation/WorkforceRouter.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  // First, remove auditService and timelineService from where they are used but not defined.
  code = code.replace(/const transferEmployeeUseCase = new TransferEmployeeUseCase.*?\n/, '');
  code = code.replace(/const mutateEmployeeUseCase = new MutateEmployeeUseCase.*?\n/, '');
  code = code.replace(/const terminateEmployeeUseCase = new TerminateEmployeeUseCase.*?\n/, '');
  
  // Then inject them properly below the auditService instantiation
  code = code.replace(
    `const auditService = new AuditServiceImpl();
const timelineService = new TimelineServiceImpl();`,
    `const auditService = new AuditServiceImpl();
const timelineService = new TimelineServiceImpl();
const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
const mutateEmployeeUseCase = new MutateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
const terminateEmployeeUseCase = new TerminateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);`
  );
  fs.writeFileSync(file, code);
}

