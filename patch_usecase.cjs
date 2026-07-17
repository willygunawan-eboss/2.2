const fs = require('fs');
const file = 'src/services/workforce/application/TransferEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'const employments = await employmentRepo.findByEmployeeNumber(dto.employeeNumber);',
  'const activeEmployment = await employmentRepo.findByEmployeeNumber(dto.employeeNumber);'
);

code = code.replace(
  "const activeEmployment = employments.find(e => e.status === 'Active');",
  "// activeEmployment is already fetched"
);

fs.writeFileSync(file, code);

const testFile = 'src/services/workforce/application/TransferEmployeeUseCase.test.ts';
let testCode = fs.readFileSync(testFile, 'utf8');
testCode = testCode.replace(
  'findByEmployeeNumber: async () => [{ id: \'empl-1\', status: \'Active\' }]',
  'findByEmployeeNumber: async () => ({ id: \'empl-1\', status: \'Active\' })'
);
testCode = testCode.replace(
  'findByEmployeeNumber: async () => [{ id: \'empl-1\', status: \'Active\' }]',
  'findByEmployeeNumber: async () => ({ id: \'empl-1\', status: \'Active\' })'
);
fs.writeFileSync(testFile, testCode);
