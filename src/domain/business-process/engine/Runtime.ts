import { ProcessDefinitionData, ProcessInstanceData, TraceContext } from '../types';
import { eventBus } from '../events/EventBus';
import { v4 as uuidv4 } from 'uuid';

export class BusinessProcessRuntime {
  public async startProcess(
    definition: ProcessDefinitionData,
    entityId: string,
    entityType: string,
    context: TraceContext
  ): Promise<ProcessInstanceData> {
    const initialState = Object.entries(definition.statesConfig).find(([_, state]) => state.type === 'INITIAL');
    if (!initialState) {
      throw new Error(`Process definition ${definition.code} has no INITIAL state.`);
    }

    const instance: ProcessInstanceData = {
      id: uuidv4(),
      definitionId: definition.id,
      entityId,
      entityType,
      currentState: initialState[0],
      status: 'RUNNING',
      startedBy: context.who,
      metadata: {}
    };

    await eventBus.publish({
      eventName: `${entityType}_PROCESS_STARTED`,
      eventVersion: '1.0',
      traceId: context.traceId,
      correlationId: context.correlationId,
      sourceModule: context.sourceModule || 'BusinessProcessEngine',
      payload: { instanceId: instance.id, entityId, state: instance.currentState }
    });

    return instance;
  }

  public async executeTransition(
    definition: ProcessDefinitionData,
    instance: ProcessInstanceData,
    targetState: string,
    context: TraceContext
  ): Promise<ProcessInstanceData> {
    
    if (instance.status !== 'RUNNING') {
      throw new Error(`Cannot transition instance ${instance.id} because status is ${instance.status}`);
    }

    const transitionKey = `${instance.currentState}_TO_${targetState}`;
    const transition = definition.transitionsConfig[transitionKey];

    if (!transition) {
      throw new Error(`Invalid transition from ${instance.currentState} to ${targetState} for process ${definition.code}`);
    }

    const oldState = instance.currentState;
    instance.currentState = targetState;
    
    const newStateConfig = definition.statesConfig[targetState];
    if (newStateConfig && newStateConfig.type === 'FINAL') {
      instance.status = 'COMPLETED';
    }

    await eventBus.publish({
      eventName: `${instance.entityType}_STATE_CHANGED`,
      eventVersion: '1.0',
      traceId: context.traceId,
      correlationId: context.correlationId,
      sourceModule: context.sourceModule || 'BusinessProcessEngine',
      payload: { instanceId: instance.id, entityId: instance.entityId, oldState, newState: targetState, status: instance.status }
    });

    return instance;
  }
}
