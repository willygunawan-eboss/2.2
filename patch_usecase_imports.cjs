const fs = require('fs');
const file = 'src/services/workforce/application/PromoteEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { IAuditService, ITimelineService } from '../../employment/application/ports/IAuditService';",
  "import { IAuditService } from '../../employment/application/ports/IAuditService';\nimport { ITimelineService } from '../../employment/application/ports/ITimelineService';"
);

fs.writeFileSync(file, code);
