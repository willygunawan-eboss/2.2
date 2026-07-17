export interface StateConfig {
  type: 'INITIAL' | 'NORMAL' | 'FINAL';
  label: string;
  description?: string;
}

export interface TransitionConfig {
  from: string;
  to: string;
  rolesAllowed?: string[];
  requireApproval?: boolean;
  approvalLevel?: number;
}

export interface ProcessDefinitionData {
  id: string;
  code: string;
  name: string;
  version: number;
  statesConfig: Record<string, StateConfig>;
  transitionsConfig: Record<string, TransitionConfig>;
}

export interface ProcessInstanceData {
  id: string;
  definitionId: string;
  entityId: string;
  entityType: string;
  currentState: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  startedBy?: string;
  metadata?: Record<string, any>;
}

export interface TraceContext {
  traceId: string;
  correlationId?: string;
  who?: string;
  where?: string;
  sourceModule?: string;
}

export interface EventPayload {
  eventName: string;
  eventVersion: string;
  traceId: string;
  correlationId?: string;
  sourceModule: string;
  payload: Record<string, any>;
}
