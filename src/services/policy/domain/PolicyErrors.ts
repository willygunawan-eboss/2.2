export class PolicyDomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'PolicyDomainError';
  }
}

export class PolicyNotFoundError extends PolicyDomainError {
  constructor(id: string) {
    super('POLICY_NOT_FOUND', `Policy ${id} not found.`);
  }
}

export class InvalidPolicyConfigurationError extends PolicyDomainError {
  constructor(message: string) {
    super('INVALID_POLICY_CONFIGURATION', message);
  }
}
