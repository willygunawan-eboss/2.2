const fs = require('fs');
const file = 'src/services/workforce/presentation/WorkforceRouter.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `const hireEmployeeUseCase = new HireEmployeeUseCase(unitOfWork, eventPublisher);`,
  `const hireEmployeeUseCase = new HireEmployeeUseCase(unitOfWork, eventPublisher, auditService, timelineService);`
);

code = code.replace(
  `const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService);`,
  `const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);`
);

// We need to move the instantiation of auditService and timelineService before hireEmployeeUseCase
code = code.replace(
  `const hireEmployeeUseCase = new HireEmployeeUseCase(unitOfWork, eventPublisher, auditService, timelineService);`,
  `// hireEmployeeUseCase will be below`
);

code = code.replace(
  `const auditService = new AuditServiceImpl();
const timelineService = new TimelineServiceImpl();
const promoteEmployeeUseCase = new PromoteEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);`,
  `const auditService = new AuditServiceImpl();
const timelineService = new TimelineServiceImpl();
const promoteEmployeeUseCase = new PromoteEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);

const hireEmployeeUseCase = new HireEmployeeUseCase(unitOfWork, eventPublisher, auditService, timelineService);
`
);

fs.writeFileSync(file, code);
