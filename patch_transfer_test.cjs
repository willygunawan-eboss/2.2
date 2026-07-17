const fs = require('fs');
let file = 'src/services/workforce/application/TransferEmployeeUseCase.test.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `{ recordAudit: vi.fn() } as any,
      { recordTimeline: vi.fn() } as any`,
  `{ recordAudit: async () => {} } as any,
      { recordTimeline: async () => {} } as any`
);
fs.writeFileSync(file, code);

file = 'src/services/workforce/application/MutateEmployeeUseCase.test.ts';
code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `{ recordAudit: vi.fn() } as any,
      { recordTimeline: vi.fn() } as any`,
  `{ recordAudit: async () => {} } as any,
      { recordTimeline: async () => {} } as any`
);
fs.writeFileSync(file, code);

