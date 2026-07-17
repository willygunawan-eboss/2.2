export class WorkflowDomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'WorkflowDomainError';
  }
}

export class DefinitionNotFoundError extends WorkflowDomainError {
  constructor(id: string) {
    super('DEFINITION_NOT_FOUND', `Workflow Definition ${id} not found.`);
  }
}

export class InstanceNotFoundError extends WorkflowDomainError {
  constructor(id: string) {
    super('INSTANCE_NOT_FOUND', `Workflow Instance ${id} not found.`);
  }
}

export class InvalidWorkflowTransitionError extends WorkflowDomainError {
  constructor(instanceId: string, currentState: string, action: string) {
    super('INVALID_TRANSITION', `Cannot apply action ${action} to instance ${instanceId} in state ${currentState}`);
  }
}

export class UnauthorizedApproverError extends WorkflowDomainError {
  constructor(actor: string, state: string) {
    super('UNAUTHORIZED_APPROVER', `Actor ${actor} is not authorized for transitions from state ${state}`);
  }
}
