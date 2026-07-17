import { WorkflowDefinition } from "../domain/WorkflowDefinition";
import { WorkflowInstance } from "../domain/WorkflowInstance";

export interface IWorkflowDefinitionRepository {
  findById(id: string): Promise<WorkflowDefinition | null>;
  findByCode(code: string): Promise<WorkflowDefinition | null>;
  save(definition: WorkflowDefinition): Promise<void>;
}

export interface IWorkflowInstanceRepository {
  findById(id: string): Promise<WorkflowInstance | null>;
  save(instance: WorkflowInstance): Promise<void>;
  findByReference(referenceType: string, referenceId: string): Promise<WorkflowInstance[]>;
}
