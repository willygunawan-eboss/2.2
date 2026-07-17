const fs = require('fs');
const file = 'src/services/workforce/application/ports/IWorkforceUnitOfWork.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `  findAll(filters: any): Promise<any[]>;`,
  `  findAll(filters: any): Promise<any[]>;\n  findByEmployeeNumber(employeeNumber: string): Promise<any>;`
);

fs.writeFileSync(file, code);
