import { IWorkflowDefinitionRepository, IWorkflowInstanceRepository } from "../repository/IWorkflowRepository";
import { WorkflowDefinition } from "../domain/WorkflowDefinition";
import { WorkflowInstance } from "../domain/WorkflowInstance";

export class InMemoryWorkflowDefinitionRepository implements IWorkflowDefinitionRepository {
  private readonly definitions = new Map<string, WorkflowDefinition>();

  async findById(id: string): Promise<WorkflowDefinition | null> {
    return this.definitions.get(id) || null;
  }

  async findByCode(code: string): Promise<WorkflowDefinition | null> {
    for (const def of this.definitions.values()) {
      if (def.code === code) return def;
    }
    return null;
  }

  async save(definition: WorkflowDefinition): Promise<void> {
    this.definitions.set(definition.id, definition);
  }
}

export class InMemoryWorkflowInstanceRepository implements IWorkflowInstanceRepository {
  private readonly instances = new Map<string, WorkflowInstance>();

  async findById(id: string): Promise<WorkflowInstance | null> {
    return this.instances.get(id) || null;
  }

  async save(instance: WorkflowInstance): Promise<void> {
    this.instances.set(instance.id, instance);
  }

  async findByReference(referenceType: string, referenceId: string): Promise<WorkflowInstance[]> {
    const result: WorkflowInstance[] = [];
    for (const instance of this.instances.values()) {
      if (instance.referenceType === referenceType && instance.referenceId === referenceId) {
        result.push(instance);
      }
    }
    return result;
  }
}
