const fs = require('fs');
const file = 'src/services/workforce/domain/WorkforceErrors.ts';
let code = fs.readFileSync(file, 'utf8');

code += `
export class EmployeeNotFoundError extends WorkforceDomainError {
  constructor(identifier: string) {
    super('EMPLOYEE_NOT_FOUND', \`Employee \${identifier} not found\`);
  }
}

export class EmployeeNotActiveError extends WorkforceDomainError {
  constructor(identifier: string) {
    super('EMPLOYEE_NOT_ACTIVE', \`Employee \${identifier} is not active\`);
  }
}

export class ActiveAssignmentNotFoundError extends WorkforceDomainError {
  constructor(employeeNumber: string) {
    super('ACTIVE_ASSIGNMENT_NOT_FOUND', \`No active assignment found for employee \${employeeNumber}\`);
  }
}

export class InvalidEffectiveDateError extends WorkforceDomainError {
  constructor(message: string) {
    super('INVALID_EFFECTIVE_DATE', message);
  }
}
`;

fs.writeFileSync(file, code);
