import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowApplicationService } from './WorkflowApplicationService';
import { InMemoryWorkflowDefinitionRepository, InMemoryWorkflowInstanceRepository } from '../infrastructure/InMemoryWorkflowRepository';
import { InMemoryWorkflowEventPublisher } from '../infrastructure/InMemoryWorkflowEventPublisher';
import { WorkflowDefinition } from '../domain/WorkflowDefinition';
import { WorkflowInstanceStatus } from '../domain/WorkflowEnums';

describe('WorkflowApplicationService', () => {
  let definitionRepo: InMemoryWorkflowDefinitionRepository;
  let instanceRepo: InMemoryWorkflowInstanceRepository;
  let eventPublisher: InMemoryWorkflowEventPublisher;
  let service: WorkflowApplicationService;

  beforeEach(() => {
    definitionRepo = new InMemoryWorkflowDefinitionRepository();
    instanceRepo = new InMemoryWorkflowInstanceRepository();
    eventPublisher = new InMemoryWorkflowEventPublisher();
    service = new WorkflowApplicationService(definitionRepo, instanceRepo, eventPublisher);
  });

  it('should start a workflow and execute transitions to completion', async () => {
    const def = WorkflowDefinition.create('def-1', 'WF_LEAVE', 'Leave Request Workflow', 'A test workflow');
    const draftedId = def.addState({ name: 'DRAFTED', isInitial: true, isFinal: false });
    const pendingManagerId = def.addState({ name: 'PENDING_MANAGER', isInitial: false, isFinal: false });
    const pendingHrId = def.addState({ name: 'PENDING_HR', isInitial: false, isFinal: false });
    const approvedId = def.addState({ name: 'APPROVED', isInitial: false, isFinal: true });
    const rejectedId = def.addState({ name: 'REJECTED', isInitial: false, isFinal: true });

    def.addTransition({ sourceStateId: draftedId, targetStateId: pendingManagerId, action: 'SUBMIT' });
    def.addTransition({ sourceStateId: pendingManagerId, targetStateId: pendingHrId, action: 'APPROVE' });
    def.addTransition({ sourceStateId: pendingManagerId, targetStateId: rejectedId, action: 'REJECT' });
    def.addTransition({ sourceStateId: pendingHrId, targetStateId: approvedId, action: 'APPROVE' });
    def.addTransition({ sourceStateId: pendingHrId, targetStateId: rejectedId, action: 'REJECT' });
    
    def.activate();

    await definitionRepo.save(def);

    const instance = await service.startWorkflow('def-1', 'LEAVE_REQUEST', 'req-1', { days: 2 }, 'emp1');
    
    expect(instance.id).toBeDefined();
    expect(instance.status).toBe(WorkflowInstanceStatus.IN_PROGRESS);
    expect(instance.currentStateId).toBe(draftedId);

    // Submit
    const updatedInstance1 = await service.executeTransition(instance.id, 'SUBMIT', 'emp1', 'Submitting request');
    expect(updatedInstance1.status).toBe(WorkflowInstanceStatus.IN_PROGRESS);
    expect(updatedInstance1.currentStateId).toBe(pendingManagerId);

    // Manager Approves
    const updatedInstance2 = await service.executeTransition(instance.id, 'APPROVE', 'manager1', 'Looks good');
    expect(updatedInstance2.status).toBe(WorkflowInstanceStatus.IN_PROGRESS);
    expect(updatedInstance2.currentStateId).toBe(pendingHrId);

    // HR Approves (Final)
    const updatedInstance3 = await service.executeTransition(instance.id, 'APPROVE', 'hr1', 'Approved by HR');
    expect(updatedInstance3.status).toBe(WorkflowInstanceStatus.COMPLETED);
    expect(updatedInstance3.history.length).toBe(3);
  });
  
  it('should throw error on invalid transition', async () => {
    const def = WorkflowDefinition.create('def-2', 'WF_TEST', 'Simple Workflow', 'A test workflow');
    const startId = def.addState({ name: 'START', isInitial: true, isFinal: false });
    const endId = def.addState({ name: 'END', isInitial: false, isFinal: true });
    def.addTransition({ sourceStateId: startId, targetStateId: endId, action: 'PROCEED' });
    def.activate();
    await definitionRepo.save(def);
    
    const instance = await service.startWorkflow('def-2', 'TEST', 'test-1', {}, 'user1');
    
    await expect(service.executeTransition(instance.id, 'INVALID_ACTION', 'user1')).rejects.toThrow('Cannot apply action INVALID_ACTION');
  });
});
