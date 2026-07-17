const fs = require('fs');
const file = 'src/services/workforce/application/MutateEmployeeUseCase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/TransferEmployeeDTO/g, 'MutateEmployeeDTO');
code = code.replace(/TransferEmployeeUseCase/g, 'MutateEmployeeUseCase');
code = code.replace(/TRANSFER_APPROVAL/g, 'MUTATION_APPROVAL');
code = code.replace(/TRANSFER_EMPLOYEE/g, 'MUTATE_EMPLOYEE');
code = code.replace(/validateTransfer/g, 'validateMutation');
code = code.replace(/processTransfer/g, 'processMutation');
code = code.replace(/transfer_wf/g, 'mutate_wf');
code = code.replace(/"TRANSFER"/g, '"MUTATION"');
code = code.replace(/EmployeeTransferred/g, 'EmployeeMutated');
code = code.replace(/TRANSFERRED/g, 'MUTATED');

fs.writeFileSync(file, code);
