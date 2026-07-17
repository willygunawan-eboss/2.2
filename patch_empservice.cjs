const fs = require('fs');
const file = 'src/services/EmployeeService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/  companyId: z\.string\(\)\.min\(1, "Company is required"\),\n/g, "");
code = code.replace(/  branchId: z\.string\(\)\.min\(1, "Branch is required"\),\n/g, "");
code = code.replace(/  divisionId: z\.string\(\)\.min\(1, "Division is required"\),\n/g, "");
code = code.replace(/  departmentId: z\.string\(\)\.min\(1, "Department is required"\),\n/g, "");
code = code.replace(/  positionId: z\.string\(\)\.min\(1, "Position is required"\),\n/g, "");
code = code.replace(/  jobGradeId: z\.string\(\)\.min\(1, "Job Grade is required"\),\n/g, "");
code = code.replace(/  managerEmployeeId: z\.string\(\)\.optional\(\)\.nullable\(\),\n/g, "");
code = code.replace(/  supervisorEmployeeId: z\.string\(\)\.optional\(\)\.nullable\(\),\n/g, "");

// findByEmployeeNumber(validatedData.employeeNumber, validatedData.companyId);
code = code.replace(/await employeeRepo\.findByEmployeeNumber\(validatedData\.employeeNumber, validatedData\.companyId\);/g, "await employeeRepo.findByEmployeeNumber(validatedData.employeeNumber);");

// validatedData.companyId in update check
code = code.replace(/if \(validatedData\.employeeNumber && validatedData\.companyId\) {/g, "if (validatedData.employeeNumber) {");
code = code.replace(/if \(validatedData\.employeeNumber !== existing\.employeeNumber \|\| validatedData\.companyId !== existing\.companyId\)/g, "if (validatedData.employeeNumber !== existing.employeeNumber)");

fs.writeFileSync(file, code);
