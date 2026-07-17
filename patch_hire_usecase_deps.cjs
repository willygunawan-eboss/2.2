const fs = require('fs');
const file = 'src/services/workforce/application/HireEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';`,
  `import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';\nimport { IAuditService } from '../../employment/application/ports/IAuditService';\nimport { ITimelineService } from '../../employment/application/ports/ITimelineService';`
);

code = code.replace(
  `  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher
  ) {}`,
  `  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly auditService: IAuditService,
    private readonly timelineService: ITimelineService
  ) {}`
);

code = code.replace(
  `// Audit moved to IAuditService`,
  `await this.auditService.recordAudit(employment.id, 'HIRE_EMPLOYEE', dto.actor, { employeeNumber: dto.employeeNumber });`
);

code = code.replace(
  `// Timeline moved to ITimelineService`,
  `await this.timelineService.recordTimeline(employment.id, 'HIRED', dto.actor, { employeeNumber: dto.employeeNumber });`
);

fs.writeFileSync(file, code);
