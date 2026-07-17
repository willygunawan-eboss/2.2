const fs = require('fs');

// Add startWorkflowByCode
let file = 'src/services/workflow/application/WorkflowApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `async executeTransition(`,
  `async startWorkflowByCode(
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

  async executeTransition(`
);
fs.writeFileSync(file, code);

// Update InMemoryWorkflowDefinitionRepository to support findByCode
file = 'src/services/workflow/infrastructure/InMemoryWorkflowRepository.ts';
code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `async findById(id: string): Promise<WorkflowDefinition | null> {
    return this.definitions.get(id) || null;
  }`,
  `async findById(id: string): Promise<WorkflowDefinition | null> {
    return this.definitions.get(id) || null;
  }

  async findByCode(code: string): Promise<WorkflowDefinition | null> {
    for (const def of this.definitions.values()) {
      if (def.code === code) return def;
    }
    return null;
  }`
);
fs.writeFileSync(file, code);

// Update IWorkflowDefinitionRepository to support findByCode
file = 'src/services/workflow/repository/IWorkflowRepository.ts';
code = fs.readFileSync(file, 'utf8');
code = code.replace(
  `findById(id: string): Promise<WorkflowDefinition | null>;`,
  `findById(id: string): Promise<WorkflowDefinition | null>;\n  findByCode(code: string): Promise<WorkflowDefinition | null>;`
);
fs.writeFileSync(file, code);

// Now update Transfer and Promote to use startWorkflowByCode
file = 'src/services/workforce/application/TransferEmployeeUseCase.ts';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/startWorkflow\(/g, 'startWorkflowByCode(');
fs.writeFileSync(file, code);

file = 'src/services/workforce/application/PromoteEmployeeUseCase.ts';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/startWorkflow\(/g, 'startWorkflowByCode(');
fs.writeFileSync(file, code);

// Now update the tests to mock startWorkflowByCode instead of startWorkflow
file = 'src/services/workforce/application/TransferEmployeeUseCase.test.ts';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/startWorkflow:/g, 'startWorkflowByCode:');
fs.writeFileSync(file, code);

file = 'src/services/workforce/application/PromoteEmployeeUseCase.test.ts';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/startWorkflow:/g, 'startWorkflowByCode:');
fs.writeFileSync(file, code);


