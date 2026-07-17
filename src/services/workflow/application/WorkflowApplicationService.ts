import { IWorkflowDefinitionRepository, IWorkflowInstanceRepository } from "../repository/IWorkflowRepository";
import { WorkflowInstance } from "../domain/WorkflowInstance";
import { DefinitionNotFoundError, InstanceNotFoundError, InvalidWorkflowTransitionError } from "../domain/WorkflowErrors";
import { IWorkflowEventPublisher } from "./ports/IWorkflowEventPublisher";

export class WorkflowApplicationService {
  constructor(
    private readonly definitionRepo: IWorkflowDefinitionRepository,
    private readonly instanceRepo: IWorkflowInstanceRepository,
    private readonly eventPublisher: IWorkflowEventPublisher
  ) {}

  async startWorkflow(
    definitionId: string, 
    referenceType: string, 
    referenceId: string, 
    context: any,
    initiator: string
  ): Promise<WorkflowInstance> {
    const definition = await this.definitionRepo.findById(definitionId);
    if (!definition) throw new DefinitionNotFoundError(definitionId);

    const initialState = definition.getInitialState();

    const instance = WorkflowInstance.start(
      definitionId,
      referenceType,
      referenceId,
      initialState.props.id,
      context
    );

    await this.instanceRepo.save(instance);

    await this.eventPublisher.publish("WorkflowStarted", {
      instanceId: instance.id,
      definitionId,
      referenceType,
      referenceId,
      initialStateId: initialState.props.id,
      initiator
    });

    return instance;
  }

  async startWorkflowByCode(
    definitionCode: string, 
    referenceType: string, 
    referenceId: string, 
    context: any,
    initiator: string
  ): Promise<WorkflowInstance> {
    const definition = await this.definitionRepo.findByCode(definitionCode);
    if (!definition) throw new DefinitionNotFoundError(definitionCode);
    const initialState = definition.getInitialState();
    const instance = WorkflowInstance.start(
      definition.id,
      referenceType,
      referenceId,
      initialState.props.id,
      context
    );
    await this.instanceRepo.save(instance);
    await this.eventPublisher.publish("WorkflowStarted", {
      instanceId: instance.id,
      definitionId: definition.id,
      referenceType,
      referenceId,
      initialStateId: initialState.props.id,
      initiator
    });
    return instance;
  }

  async executeTransition(
    instanceId: string,
    action: string,
    actor: string,
    comments?: string
  ): Promise<WorkflowInstance> {
    const instance = await this.instanceRepo.findById(instanceId);
    if (!instance) throw new InstanceNotFoundError(instanceId);

    const definition = await this.definitionRepo.findById(instance.definitionId);
    if (!definition) throw new DefinitionNotFoundError(instance.definitionId);

    const currentStateId = instance.currentStateId;
    const validTransitions = definition.getValidTransitions(currentStateId);
    
    // Find the transition matching the requested action
    const transition = validTransitions.find(t => t.props.action === action);
    if (!transition) {
       throw new InvalidWorkflowTransitionError(instance.id, currentStateId, action);
    }
    
    const targetState = definition.states.find(s => s.props.id === transition.props.targetStateId);
    if (!targetState) {
        throw new Error(`Target state ${transition.props.targetStateId} not found in definition`);
    }

    instance.executeTransition(
        targetState.props.id, 
        action, 
        actor, 
        targetState.props.isFinal,
        comments
    );
    
    await this.instanceRepo.save(instance);

    await this.eventPublisher.publish("WorkflowTransitionExecuted", {
      instanceId: instance.id,
      actor,
      action,
      sourceStateId: currentStateId,
      targetStateId: targetState.props.id,
      status: instance.status
    });

    if (targetState.props.isFinal) {
       await this.eventPublisher.publish("WorkflowCompleted", {
          instanceId: instance.id,
          referenceType: instance.referenceType,
          referenceId: instance.referenceId
       });
    }

    return instance;
  }
}
