const fs = require('fs');
const file = 'src/services/workforce/application/HireEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { WorkforceDomainService } from '../domain/WorkforceDomainService';`,
  `import { WorkforceDomainService } from '../domain/WorkforceDomainService';\nimport { WorkforceDomainError } from '../domain/WorkforceErrors';`
);

code = code.replace(/throw new Error\("Employee Number is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");');
code = code.replace(/throw new Error\("Name is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Name is required");');
code = code.replace(/throw new Error\("Employment Type is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Employment Type is required");');
code = code.replace(/throw new Error\("Organization is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Organization is required");');
code = code.replace(/throw new Error\("Position is required"\);/g, 'throw new WorkforceDomainError("VALIDATION_ERROR", "Position is required");');

// replace findall with findByEmployeeNumber
code = code.replace(
  `const existingEmployees = await employeeRepo.findAll({ keyword: dto.employeeNumber, companyId: dto.companyId });`,
  `const existingEmp = await employeeRepo.findByEmployeeNumber(dto.employeeNumber);\n      const existingEmployees = existingEmp ? [existingEmp] : [];`
);

// Timeline / Audit changes
code = code.replace(
  `console.log(\`[Audit] Hire Employee for \${dto.employeeNumber} by \${dto.actor}\`);`,
  `// Audit moved to IAuditService`
);
code = code.replace(
  `console.log(\`[Timeline] Employee Hired \${dto.employeeNumber}\`);`,
  `// Timeline moved to ITimelineService`
);

fs.writeFileSync(file, code);
