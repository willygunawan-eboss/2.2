const fs = require('fs');
let file = 'src/services/workflow/domain/WorkflowDefinition.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface WorkflowDefinitionProps {
  id: string;
  name: string;
  description: string;
  version: number;
  status: WorkflowDefinitionStatus;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
}`,
  `export interface WorkflowDefinitionProps {
  id: string;
  code: string;
  name: string;
  description: string;
  version: number;
  status: WorkflowDefinitionStatus;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
}`
);

code = code.replace(
  `public static create(
    id: string | null,
    name: string,
    description: string,
    status: WorkflowDefinitionStatus = WorkflowDefinitionStatus.DRAFT,
    version: number = 1
  ): WorkflowDefinition {
    return new WorkflowDefinition({
      id: id || uuidv4(),
      name,
      description,
      status,
      version,
      states: [],
      transitions: []
    });
  }`,
  `public static create(
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
  }`
);

code = code.replace(`get name(): string { return this.props.name; }`, `get code(): string { return this.props.code; }\n  get name(): string { return this.props.name; }`);
fs.writeFileSync(file, code);

// Patch the tests and applications
file = 'src/services/workflow/application/WorkflowApplicationService.test.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(/WorkflowDefinition\.create\('def-1', 'Leave Request Workflow',/g, "WorkflowDefinition.create('def-1', 'WF_LEAVE', 'Leave Request Workflow',");
  code = code.replace(/WorkflowDefinition\.create\('def-2', 'Simple Workflow',/g, "WorkflowDefinition.create('def-2', 'WF_TEST', 'Simple Workflow',");
  fs.writeFileSync(file, code);
}
