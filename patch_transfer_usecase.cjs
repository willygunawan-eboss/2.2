const fs = require('fs');
const file = 'src/services/workforce/application/TransferEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { WorkforceDomainService } from '../domain/WorkforceDomainService';`,
  `import { WorkforceDomainService } from '../domain/WorkforceDomainService';\nimport { WorkforceDomainError, EmployeeNotFoundError, EmployeeNotActiveError, ActiveAssignmentNotFoundError } from '../domain/WorkforceErrors';`
);

code = code.replace(
  `import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';`,
  `import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';\nimport { IAuditService } from '../../employment/application/ports/IAuditService';\nimport { ITimelineService } from '../../employment/application/ports/ITimelineService';`
);

code = code.replace(
  `  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly policyService: PolicyApplicationService,
    private readonly workflowService: WorkflowApplicationService
  ) {}`,
  `  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly policyService: PolicyApplicationService,
    private readonly workflowService: WorkflowApplicationService,
    private readonly auditService: IAuditService,
    private readonly timelineService: ITimelineService
  ) {}`
);

code = code.replace(/throw new Error\("Employee Number is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");');
code = code.replace(/throw new Error\("New Organization is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "New Organization is required");');
code = code.replace(/throw new Error\("New Position is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "New Position is required");');
code = code.replace(/throw new Error\("Effective Date is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Effective Date is required");');
code = code.replace(/throw new Error\("Transfer Reason is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Transfer Reason is required");');

code = code.replace(
  `const existingEmployees = await employeeRepo.findAll({ keyword: dto.employeeNumber, companyId: dto.companyId });
      const employee = existingEmployees.find(e => e.employeeNumber === dto.employeeNumber);
      if (!employee) throw new Error(\`Employee \${dto.employeeNumber} not found\`);`,
  `const employee = await employeeRepo.findByEmployeeNumber(dto.employeeNumber);
      if (!employee) throw new EmployeeNotFoundError(dto.employeeNumber);`
);

code = code.replace(
  `      if (!activeEmployment) throw new Error(\`No active employment found for \${dto.employeeNumber}\`);`,
  `      if (!activeEmployment) throw new EmployeeNotFoundError(dto.employeeNumber);`
);

// We need to pass workflowCode and policyCode instead of names!
code = code.replace(
  `const policyResult = await this.policyService.evaluatePolicyByName('Transfer Approval Policy', policyContext);`,
  `const policyResult = await this.policyService.evaluatePolicyByCode('TRANSFER_APPROVAL', policyContext);`
);

code = code.replace(
  `'transfer-workflow-def', // this would come from policy or constant`,
  `'transfer_wf',`
);

code = code.replace(
  `      // Update Employee record if necessary (e.g. positionId denormalization)
      employee.positionId = dto.newPositionId;
      await employeeRepo.update(employee.id, employee);`,
  `      // We no longer denormalize positionId to employee
      // await employeeRepo.update(employee.id, employee);`
);

code = code.replace(
  `      console.log(\`[Audit] Old Assignment \${updatedOldAssignment.id} terminated\`);
      console.log(\`[Audit] New Assignment \${newAssignment.id} created\`);
      console.log(\`[Audit] Actor: \${dto.actor}, Reason: \${dto.reason}, EffectiveDate: \${dto.effectiveDate}\`);
      console.log(\`[Timeline] Employee Transferred \${dto.employeeNumber}\`);`,
  `      await this.auditService.recordAudit(activeEmployment.id, "TERMINATE_ASSIGNMENT", dto.actor, { assignmentId: updatedOldAssignment.id, reason: dto.reason });
      await this.auditService.recordAudit(activeEmployment.id, "CREATE_ASSIGNMENT", dto.actor, { assignmentId: newAssignment.id, reason: dto.reason, type: "TRANSFER" });
      await this.timelineService.recordTimeline(activeEmployment.id, "TRANSFERRED", dto.actor, { reason: dto.reason, effectiveDate: dto.effectiveDate, newPositionId: dto.newPositionId });`
);


fs.writeFileSync(file, code);
