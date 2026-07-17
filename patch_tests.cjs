const fs = require('fs');

const files = [
  'src/services/workforce/application/HireEmployeeUseCase.test.ts',
  'src/services/workforce/application/TransferEmployeeUseCase.test.ts',
  'src/services/workforce/application/PromoteEmployeeUseCase.test.ts'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  
  code = code.replace(
    /findAll: async \(\) => \[\{ id: 'emp-1', employeeNumber: 'E001', status: 'Active' \}\]/g,
    "findByEmployeeNumber: async () => ({ id: 'emp-1', employeeNumber: 'E001', status: 'Active' })"
  );
  
  code = code.replace(
    /findAll: async \(\) => \[\]/g,
    "findByEmployeeNumber: async () => null"
  );

  fs.writeFileSync(file, code);
}
