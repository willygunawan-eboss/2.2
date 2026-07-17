const fs = require('fs');
const file = 'src/services/workforce/domain/WorkforceDomainService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { 
  DuplicateEmployeeNumberError, 
  InactiveOrganizationError, 
  InactivePositionError 
} from "./WorkforceErrors";`,
  `import { 
  DuplicateEmployeeNumberError, 
  InactiveOrganizationError, 
  InactivePositionError,
  EmployeeNotFoundError,
  EmployeeNotActiveError,
  ActiveAssignmentNotFoundError,
  InvalidEffectiveDateError
} from "./WorkforceErrors";`
);

// Replace default Errors in validatePromotion
code = code.replace(/if \(!employee\) throw new Error\("Employee not found"\);/g, "if (!employee) throw new EmployeeNotFoundError('UNKNOWN');");
code = code.replace(/if \(employee\.status !== 'Active'\) throw new Error\("Employee is not active"\);/g, "if (employee.status !== 'Active') throw new EmployeeNotActiveError(employee.employeeNumber);");
code = code.replace(/if \(!currentAssignment\) throw new Error\("Active assignment not found"\);/g, "if (!currentAssignment) throw new ActiveAssignmentNotFoundError(employee.employeeNumber);");
code = code.replace(/throw new Error\("Promotion effective date must be after current assignment effective date"\);/g, "throw new InvalidEffectiveDateError('Promotion effective date must be after current assignment effective date');");

// Replace default Errors in validateTransfer
code = code.replace(/throw new Error\("Transfer effective date must be after current assignment effective date"\);/g, "throw new InvalidEffectiveDateError('Transfer effective date must be after current assignment effective date');");


// Clean up createHireEntities
const createHireOriginal = `    const employeeData = {
      id: employeeId,
      employeeNumber: dto.employeeNumber,
      name: dto.name,
      email: dto.email,
      nationalIdentityNumber: dto.nationalIdentityNumber,
      companyId: dto.companyId,
      branchId: dto.branchId,
      divisionId: dto.divisionId,
      departmentId: dto.departmentId,
      positionId: dto.positionId,
      jobGradeId: dto.jobGradeId,
      employmentStatus: dto.employmentStatus,
      hireDate: dto.effectiveDate,
      contractStartDate: dto.contractStartDate,
      createdBy: dto.actor,
      status: 'Active'
    };`;

const createHireNew = `    const employeeData = {
      id: employeeId,
      employeeNumber: dto.employeeNumber,
      name: dto.name,
      email: dto.email,
      nationalIdentityNumber: dto.nationalIdentityNumber,
      employmentStatus: dto.employmentStatus,
      hireDate: dto.effectiveDate,
      contractStartDate: dto.contractStartDate,
      createdBy: dto.actor,
      status: 'Active'
    };`;

code = code.replace(createHireOriginal, createHireNew);

fs.writeFileSync(file, code);
