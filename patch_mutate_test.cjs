const fs = require('fs');
const file = 'src/services/workforce/application/MutateEmployeeUseCase.test.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/TransferEmployeeUseCase/g, 'MutateEmployeeUseCase');
code = code.replace(/TransferEmployeeDTO/g, 'MutateEmployeeDTO');
code = code.replace(/should transfer employee successfully/g, 'should mutate employee successfully');
code = code.replace(/Transfer effective date must be after current assignment effective date/g, 'Mutation effective date must be after current assignment effective date');
code = code.replace(/EmployeeTransferred/g, 'EmployeeMutated');

fs.writeFileSync(file, code);
