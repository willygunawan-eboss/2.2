export class WorkforceDomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'WorkforceDomainError';
  }
}

export class DuplicateEmployeeNumberError extends WorkforceDomainError {
  constructor(employeeNumber: string) {
    super('DUPLICATE_EMPLOYEE_NUMBER', `Employee Number ${employeeNumber} already exists`);
  }
}

export class InactiveOrganizationError extends WorkforceDomainError {
  constructor(organizationId: string) {
    super('INACTIVE_ORGANIZATION', `Organization ${organizationId} is not active or does not exist`);
  }
}

export class InactivePositionError extends WorkforceDomainError {
  constructor(positionId: string) {
    super('INACTIVE_POSITION', `Position ${positionId} is not active or does not exist`);
  }
}

export class EmployeeNotFoundError extends WorkforceDomainError {
  constructor(identifier: string) {
    super('EMPLOYEE_NOT_FOUND', `Employee ${identifier} not found`);
  }
}

export class EmployeeNotActiveError extends WorkforceDomainError {
  constructor(identifier: string) {
    super('EMPLOYEE_NOT_ACTIVE', `Employee ${identifier} is not active`);
  }
}

export class ActiveAssignmentNotFoundError extends WorkforceDomainError {
  constructor(employeeNumber: string) {
    super('ACTIVE_ASSIGNMENT_NOT_FOUND', `No active assignment found for employee ${employeeNumber}`);
  }
}

export class InvalidEffectiveDateError extends WorkforceDomainError {
  constructor(message: string) {
    super('INVALID_EFFECTIVE_DATE', message);
  }
}
