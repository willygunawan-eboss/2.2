const fs = require('fs');

let file = 'src/services/workforce/application/HireEmployeeUseCase.test.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "findAll: async () => [{ id: 'emp-1', employeeNumber: 'E001', status: 'Active' }]",
  "findByEmployeeNumber: async () => ({ id: 'emp-1', employeeNumber: 'E001', status: 'Active' })"
);

code = code.replace(
  "findAll: async () => []",
  "findByEmployeeNumber: async () => null"
);

code = code.replace(
  `unitOfWorkMock,
      eventPublisherMock`,
  `unitOfWorkMock,
      eventPublisherMock,
      { recordAudit: async () => {} },
      { recordTimeline: async () => {} }`
);

fs.writeFileSync(file, code);

file = 'src/services/workforce/application/TransferEmployeeUseCase.test.ts';
code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "evaluatePolicyByName: async () => ({ isAllowed: true, effect: 'ALLOW' })",
  "evaluatePolicyByCode: async () => ({ isAllowed: true, effect: 'ALLOW' })"
);

code = code.replace(
  `unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock
    );`,
  `unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      { recordAudit: async () => {} },
      { recordTimeline: async () => {} }
    );`
);
fs.writeFileSync(file, code);

file = 'src/services/workforce/application/PromoteEmployeeUseCase.test.ts';
code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "evaluatePolicyByName: async () => ({ isAllowed: true, effect: 'ALLOW' })",
  "evaluatePolicyByCode: async () => ({ isAllowed: true, effect: 'ALLOW' })"
);
fs.writeFileSync(file, code);

