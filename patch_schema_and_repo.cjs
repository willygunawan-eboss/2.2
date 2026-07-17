const fs = require('fs');

// Fix schema.ts
let schema = fs.readFileSync('src/db/schema.ts', 'utf-8');

schema = schema.replace(/fullName: text\("full_name"\)/, 'name: text("name")');
schema = schema.replace(/corporateEmail: text\("corporate_email"\)/, 'email: text("email")');

schema = schema.replace(/certifications: many\(certifications\)/, 'certifications: many(employeeCertifications)');
schema = schema.replace(/trainings: many\(trainings\)/, 'trainings: many(employeeTrainings)');
schema = schema.replace(/documents: many\(documents\)/, 'documents: many(employeeDocuments)');

fs.writeFileSync('src/db/schema.ts', schema);
console.log("Patched schema.ts");

// Fix EmployeeRepository.ts
let repo = fs.readFileSync('src/repositories/EmployeeRepository.ts', 'utf-8');
repo = repo.replace(/employees\.fullName/g, 'employees.name');
repo = repo.replace(/employees\.corporateEmail/g, 'employees.email');
fs.writeFileSync('src/repositories/EmployeeRepository.ts', repo);
console.log("Patched EmployeeRepository.ts");

// Fix EmployeeService.ts
let svc = fs.readFileSync('src/services/EmployeeService.ts', 'utf-8');
svc = svc.replace(/fullName:/g, 'name:');
svc = svc.replace(/corporateEmail:/g, 'email:');
fs.writeFileSync('src/services/EmployeeService.ts', svc);
console.log("Patched EmployeeService.ts");
