export enum PolicyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum PolicyEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY'
}

export enum ConditionOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
  LESS_THAN_OR_EQUALS = 'LESS_THAN_OR_EQUALS',
  CONTAINS = 'CONTAINS',
  IN = 'IN'
}
