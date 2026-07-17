import { WorkflowDefinitionStatus } from './WorkflowEnums';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowStateProps {
  id: string;
  name: string;
  isInitial: boolean;
  isFinal: boolean;
}

export class WorkflowState {
  constructor(public readonly props: WorkflowStateProps) {}
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
}

export interface WorkflowTransitionProps {
  id: string;
  sourceStateId: string;
  targetStateId: string;
  action: string;
  requiredRole?: string;
  conditions?: WorkflowCondition[];
}

export class WorkflowTransition {
  constructor(public readonly props: WorkflowTransitionProps) {}
}

export interface WorkflowDefinitionProps {
  id: string;
  code: string;
  name: string;
  description: string;
  version: number;
  status: WorkflowDefinitionStatus;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
}

export class WorkflowDefinition {
  private constructor(private readonly props: WorkflowDefinitionProps) {}

  public static create(
    id: string | null,
    code: string,
    name: string,
    description: string,
    status: WorkflowDefinitionStatus = WorkflowDefinitionStatus.DRAFT,
    version: number = 1
  ): WorkflowDefinition {
    return new WorkflowDefinition({
      id: id || uuidv4(),
      code,
      name,
      description,
      status,
      version,
      states: [],
      transitions: []
    });
  }

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get status(): WorkflowDefinitionStatus { return this.props.status; }
  get states(): WorkflowState[] { return this.props.states; }
  get transitions(): WorkflowTransition[] { return this.props.transitions; }
  
  public addState(stateProps: Omit<WorkflowStateProps, 'id'>) {
    const state = new WorkflowState({
      id: uuidv4(),
      ...stateProps
    });
    this.props.states.push(state);
    return state.props.id;
  }

  public addTransition(transitionProps: Omit<WorkflowTransitionProps, 'id'>) {
    const transition = new WorkflowTransition({
      id: uuidv4(),
      ...transitionProps
    });
    this.props.transitions.push(transition);
  }

  public activate() {
    if (this.props.states.length === 0) {
      throw new Error("Cannot activate workflow definition without states");
    }
    if (!this.props.states.find(s => s.props.isInitial)) {
      throw new Error("Cannot activate workflow definition without an initial state");
    }
    this.props.status = WorkflowDefinitionStatus.ACTIVE;
  }

  public getInitialState(): WorkflowState {
    const initial = this.props.states.find(s => s.props.isInitial);
    if (!initial) throw new Error("No initial state defined");
    return initial;
  }

  public getValidTransitions(currentStateId: string): WorkflowTransition[] {
    return this.props.transitions.filter(t => t.props.sourceStateId === currentStateId);
  }
}
