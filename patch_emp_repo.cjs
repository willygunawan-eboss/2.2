const fs = require('fs');
const file = 'src/repositories/EmployeeRepository.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/    if \(filters\.companyId\) conditions\.push\(eq\(employees\.companyId, filters\.companyId\)\);\n/g, "");
code = code.replace(/    if \(filters\.branchId\) conditions\.push\(eq\(employees\.branchId, filters\.branchId\)\);\n/g, "");
code = code.replace(/    if \(filters\.departmentId\) conditions\.push\(eq\(employees\.departmentId, filters\.departmentId\)\);\n/g, "");
code = code.replace(/    if \(filters\.positionId\) conditions\.push\(eq\(employees\.positionId, filters\.positionId\)\);\n/g, "");

code = code.replace(/      with: {\n        company: true,\n        department: true,\n        position: true,\n        branch: true\n      },\n/g, "");

code = code.replace(/      with: {\n        company: true,\n        branch: true,\n        division: true,\n        department: true,\n        section: true,\n        team: true,\n        position: true,\n        jobGrade: true,\n        manager: true,\n        supervisor: true\n      }\n/g, "");

// findByEmployeeNumber
code = code.replace(/  async findByEmployeeNumber\(employeeNumber: string, companyId: string\) {\n    return await \(this\.tx \|\| db\)\.query\.employees\.findFirst\({\n      where: and\(\n        eq\(employees\.employeeNumber, employeeNumber\),\n        eq\(employees\.companyId, companyId\)\n      \)\n    }\);\n  }/g, `  async findByEmployeeNumber(employeeNumber: string) {
    return await (this.tx || db).query.employees.findFirst({
      where: eq(employees.employeeNumber, employeeNumber)
    });
  }`);

fs.writeFileSync(file, code);
