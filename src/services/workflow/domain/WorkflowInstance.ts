import { WorkflowInstanceStatus } from './WorkflowEnums';
import { InvalidWorkflowTransitionError } from './WorkflowErrors';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowHistoryProps {
  id: string;
  instanceId: string;
  sourceStateId: string;
  targetStateId: string;
  action: string;
  actor: string;
  comments?: string;
  timestamp: string;
}

export class WorkflowHistory {
  constructor(public readonly props: WorkflowHistoryProps) {}
}

export interface WorkflowInstanceProps {
  id: string;
  definitionId: string;
  referenceType: string;
  referenceId: string;
  status: WorkflowInstanceStatus;
  currentStateId: string;
  context: string;
  history: WorkflowHistory[];
  createdAt: string;
  updatedAt: string;
}

export class WorkflowInstance {
  private constructor(private readonly props: WorkflowInstanceProps) {}

  public static start(
    definitionId: string,
    referenceType: string,
    referenceId: string,
    initialStateId: string,
    context: any = {}
  ): WorkflowInstance {
    const now = new Date().toISOString();
    return new WorkflowInstance({
      id: uuidv4(),
      definitionId,
      referenceType,
      referenceId,
      status: WorkflowInstanceStatus.IN_PROGRESS,
      currentStateId: initialStateId,
      context: JSON.stringify(context),
      history: [],
      createdAt: now,
      updatedAt: now
    });
  }

  get id(): string { return this.props.id; }
  get status(): WorkflowInstanceStatus { return this.props.status; }
  get currentStateId(): string { return this.props.currentStateId; }
  get history(): WorkflowHistory[] { return this.props.history; }
  get referenceType(): string { return this.props.referenceType; }
  get referenceId(): string { return this.props.referenceId; }
  get definitionId(): string { return this.props.definitionId; }
  get context(): any { return JSON.parse(this.props.context); }

  public executeTransition(
    targetStateId: string,
    action: string,
    actor: string,
    isTargetFinal: boolean,
    comments?: string
  ) {
    if (this.status !== WorkflowInstanceStatus.IN_PROGRESS) {
      throw new InvalidWorkflowTransitionError(this.id, this.currentStateId, action);
    }

    const historyEntry = new WorkflowHistory({
      id: uuidv4(),
      instanceId: this.id,
      sourceStateId: this.currentStateId,
      targetStateId: targetStateId,
      action,
      actor,
      comments,
      timestamp: new Date().toISOString()
    });

    this.props.history.push(historyEntry);
    this.props.currentStateId = targetStateId;

    if (isTargetFinal) {
      this.props.status = WorkflowInstanceStatus.COMPLETED;
    }

    this.props.updatedAt = new Date().toISOString();
  }

  public cancel(actor: string, reason?: string) {
    if (this.status === WorkflowInstanceStatus.COMPLETED || this.status === WorkflowInstanceStatus.CANCELLED) {
       throw new InvalidWorkflowTransitionError(this.id, this.currentStateId, 'CANCEL');
    }
    this.props.status = WorkflowInstanceStatus.CANCELLED;
    this.props.updatedAt = new Date().toISOString();
  }
}
