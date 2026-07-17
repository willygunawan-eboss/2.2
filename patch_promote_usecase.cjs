const fs = require('fs');
const file = 'src/services/workforce/application/PromoteEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { WorkforceDomainService } from '../domain/WorkforceDomainService';`,
  `import { WorkforceDomainService } from '../domain/WorkforceDomainService';\nimport { WorkforceDomainError, EmployeeNotFoundError } from '../domain/WorkforceErrors';`
);

code = code.replace(/throw new Error\("Employee Number is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");');
code = code.replace(/throw new Error\("New Organization is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "New Organization is required");');
code = code.replace(/throw new Error\("New Position is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "New Position is required");');
code = code.replace(/throw new Error\("Effective Date is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Effective Date is required");');
code = code.replace(/throw new Error\("Promotion Reason is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Promotion Reason is required");');


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

code = code.replace(
  `const policyResult = await this.policyService.evaluatePolicyByName('Promotion Approval Policy', policyContext);`,
  `const policyResult = await this.policyService.evaluatePolicyByCode('PROMOTION_APPROVAL', policyContext);`
);

code = code.replace(
  `'promote-workflow-def',`,
  `'promote_wf',`
);

code = code.replace(
  `      employee.positionId = dto.newPositionId;
      if (dto.newJobGradeId) {
        employee.jobGradeId = dto.newJobGradeId;
      }
      await employeeRepo.update(employee.id, employee);`,
  `      // No longer denormalize positionId or jobGradeId to employee
      // if (dto.newJobGradeId) { employee.jobGradeId = dto.newJobGradeId; await employeeRepo.update(employee.id, employee); }`
);

fs.writeFileSync(file, code);
