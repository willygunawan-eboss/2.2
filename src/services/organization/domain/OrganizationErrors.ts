export class OrganizationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'OrganizationError';
  }
}

export class OrganizationNotFoundError extends OrganizationError {
  constructor(id: string) {
    super(`Organization with ID ${id} not found`, 'ORG_NOT_FOUND');
  }
}

export class InvalidOrganizationCodeError extends OrganizationError {
  constructor(code: string) {
    super(`Invalid organization code: ${code}`, 'INVALID_ORG_CODE');
  }
}

export class InvalidOrganizationParentError extends OrganizationError {
  constructor(reason: string) {
    super(`Invalid parent organization: ${reason}`, 'INVALID_PARENT');
  }
}

export class CircularDependencyError extends OrganizationError {
  constructor(id: string, parentId: string) {
    super(`Setting parent ${parentId} to ${id} creates a circular dependency`, 'CIRCULAR_DEPENDENCY');
  }
}

export class MultipleRootOrganizationError extends OrganizationError {
  constructor() {
    super(`Only one root organization is allowed`, 'MULTIPLE_ROOT_NOT_ALLOWED');
  }
}
