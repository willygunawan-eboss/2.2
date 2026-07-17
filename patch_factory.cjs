const fs = require('fs');
let content = fs.readFileSync('src/services/employment/EmploymentFactory.ts', 'utf8');

const imports = `import { AssignmentRepositoryImpl } from "./repository/AssignmentRepositoryImpl.js";
import { AssignmentApplicationService } from "./application/AssignmentApplicationService.js";
import { AssignmentQueryService } from "./application/AssignmentQueryService.js";`;

content = content.replace(
  'import { AuditServiceImpl } from "./infrastructure/AuditServiceImpl.js";',
  'import { AuditServiceImpl } from "./infrastructure/AuditServiceImpl.js";\n' + imports
);

const assignmentExports = `
const assignmentRepository = new AssignmentRepositoryImpl();
export const assignmentApplicationService = new AssignmentApplicationService(
  assignmentRepository,
  eventPublisher,
  timelineService,
  auditService
);
export const assignmentQueryService = new AssignmentQueryService(assignmentRepository);
`;

content += assignmentExports;

fs.writeFileSync('src/services/employment/EmploymentFactory.ts', content);
