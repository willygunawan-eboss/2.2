const fs = require('fs');

let file = 'src/services/workforce/application/HireEmployeeUseCase.test.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `findAll: vi.fn().mockResolvedValue([]),`,
  `findByEmployeeNumber: vi.fn().mockResolvedValue(null),`
);

code = code.replace(
  `useCase = new HireEmployeeUseCase(unitOfWork, eventPublisher);`,
  `useCase = new HireEmployeeUseCase(unitOfWork, eventPublisher, { recordAudit: vi.fn() } as any, { recordTimeline: vi.fn() } as any);`
);

fs.writeFileSync(file, code);

